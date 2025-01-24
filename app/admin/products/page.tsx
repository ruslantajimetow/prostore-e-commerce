import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteProduct, getAllProducts } from '@/lib/actions/product.actions';
import { formatCurrency, formatId } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ query: string; page: string; category: string }>;
}) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || '';
  const category = searchParams.category || '';

  const products = await getAllProducts({ page, query, category });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button size="sm">Create Product</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((p) => (
            <TableRow key={p.slug}>
              <TableCell>{formatId(p.id)}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(p.price)}
              </TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{p.rating}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/products/${p.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={p.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products.totalPages && products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  );
}
