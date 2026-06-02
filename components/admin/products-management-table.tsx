"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/actions/manage-products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  label: string;
  value: string;
  updatedAt: string;
}


export function ProductsManagementTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteLabel, setPendingDeleteLabel] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ label: "", value: "" });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    const result = await fetchProducts();
    if (result.data) {
      setProducts(result.data as any);
    } else {
      toast.error("Failed to load products");
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const CleanedFormData = {
      label: formData.label.trim(),
      value: formData.value.trim(),
    };

    try {
      if (editingId) {
        const result = await updateProduct(editingId, CleanedFormData.label, CleanedFormData.value);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Product updated successfully");
          setEditingId(null);
          await loadProducts();
        }
      } else {
        const result = await createProduct(CleanedFormData.label, CleanedFormData.value);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Product created successfully");
          await loadProducts();
        }
      }
      setFormData({ label: "", value: "" });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  function requestDelete(id: string, label?: string) {
    setPendingDeleteId(id);
    setPendingDeleteLabel(label ?? null);
    setConfirmOpen(true);
  }

  async function performDelete() {
    if (!pendingDeleteId) return;
    setIsSubmitting(true);
    try {
      const result = await deleteProduct(pendingDeleteId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Product deleted successfully");
        await loadProducts();
      }
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
      setPendingDeleteId(null);
      setPendingDeleteLabel(null);
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setFormData({ label: product.label, value: product.value });
    setOpen(true);
  }

  function handleNewProduct() {
    setEditingId(null);
    setFormData({ label: "", value: "" });
    setOpen(true);
  }

  if (isLoading) {
    return (
      <Skeleton className="size-full rounded-lg" />
    );
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <DialogTrigger asChild>
            <Button onClick={handleNewProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="label">Product Label</Label>
              <Input
                id="label"
                placeholder="e.g., Office Bag"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="value">Product Value</Label>
              <Input
                id="value"
                placeholder="e.g., OFFICE_BAG"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4 lg:hidden">
        {products.map((product) => (
          <Card key={product.id} className="w-full">
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{product.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => requestDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Product Code</p>
                  <p className="text-sm text-muted-foreground font-mono">{product.value}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const date = new Date(product.updatedAt);
                      return `${new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(date)} at ${new Intl.DateTimeFormat("en-US", {
                        timeStyle: "short",
                      }).format(date)}`;
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden lg:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No products found. Create your first product.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.label}</TableCell>
                  <TableCell className="font-mono text-sm">{product.value}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {(() => {
                      const date = new Date(product.updatedAt);
                      return `${new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(date)} at ${new Intl.DateTimeFormat("en-US", {
                        timeStyle: "short",
                      }).format(date)}`;
                    })()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => requestDelete(product.id, product.label)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete {pendingDeleteLabel ? `"${pendingDeleteLabel}"` : "this product"}? This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={performDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
