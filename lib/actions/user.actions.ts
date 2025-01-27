'use server';

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateAdminUserSchema,
} from '@/lib/validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';
import { z } from 'zod';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export const signInAction = async (prevState: unknown, formData: FormData) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid credentials' };
  }
};

export const signOutAction = async () => {
  await signOut();
};

export const signUpAction = async (prevState: unknown, formData: FormData) => {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });
    const hashedPassword = await hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: user.password,
    });

    return { success: true, message: 'Signed up successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
};

// get user by id

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found!');

  return user;
};

// update user address
export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error('No user Found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: 'User address updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

// Update user's payment method

export const updateUserPaymentMethod = async (
  data: z.infer<typeof paymentMethodSchema>
) => {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error('No User Found');

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymantMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: 'Payment Method updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const updateUserProfile = async (user: {
  name: string;
  email: string;
}) => {
  try {
    const session = await auth();
    if (!session) throw new Error('User Not Authorized');

    const currentUser = await prisma.user.findFirst({
      where: { id: session.user?.id },
    });

    if (!currentUser) throw new Error('User Not Found');

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: 'User Name updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export async function getAllUsers({
  page,
  limit = PAGE_SIZE,
  query,
}: {
  page: number;
  limit?: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//delete user for admin
export async function deleteUser(userId: string) {
  try {
    const existingUser = await prisma.user.findFirst({ where: { id: userId } });

    if (!existingUser) throw new Error('User not found');

    await prisma.user.delete({ where: { id: userId } });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//update user
export async function updateUserByAdmin(
  user: z.infer<typeof updateAdminUserSchema>
) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
