'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { LineItem } from '@/types/invoice';

export function LineItemManager() {
  const { serviceDetails, addLineItem, removeLineItem, updateLineItem } = useInvoiceStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LineItem | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    subDescriptions: '',
    unitPrice: '',
    quantity: '1',
  });

  const resetForm = () => {
    setFormData({
      description: '',
      subDescriptions: '',
      unitPrice: '',
      quantity: '1',
    });
    setEditingItem(null);
  };

  const handleAdd = () => {
    if (!formData.description || !formData.unitPrice) return;

    const subDescArray = formData.subDescriptions
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    addLineItem({
      description: formData.description,
      subDescriptions: subDescArray,
      unitPrice: parseFloat(formData.unitPrice),
      quantity: parseInt(formData.quantity) || 1,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (item: LineItem) => {
    setEditingItem(item);
    setFormData({
      description: item.description,
      subDescriptions: item.subDescriptions.join('\n'),
      unitPrice: item.unitPrice.toString(),
      quantity: item.quantity.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingItem || !formData.description || !formData.unitPrice) return;

    const subDescArray = formData.subDescriptions
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    updateLineItem(editingItem.id, {
      description: formData.description,
      subDescriptions: subDescArray,
      unitPrice: parseFloat(formData.unitPrice),
      quantity: parseInt(formData.quantity) || 1,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this line item?')) {
      removeLineItem(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Line Items</h3>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-131.25">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Line Item' : 'Add Line Item'}
              </DialogTitle>
              <DialogDescription>
                Enter the details for this service or product
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="e.g., Booth Construction"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subDescriptions">
                  Sub-descriptions (one per line)
                </Label>
                <textarea
                  id="subDescriptions"
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g.,&#10;- Raised Platform&#10;- Lightbox Signage&#10;- Acrylic Finish"
                  value={formData.subDescriptions}
                  onChange={(e) =>
                    setFormData({ ...formData, subDescriptions: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="unitPrice">Unit Price (AED) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, unitPrice: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={editingItem ? handleUpdate : handleAdd}
                disabled={!formData.description || !formData.unitPrice}
              >
                {editingItem ? 'Update' : 'Add'} Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {serviceDetails && serviceDetails.lineItems.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-25">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceDetails.lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.description}</div>
                      {item.subDescriptions.length > 0 && (
                        <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                          {item.subDescriptions.map((sub, idx) => (
                            <li key={idx}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.total)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p>No line items added yet. Click &quot;Add Item&quot; to get started.</p>
        </div>
      )}

      {serviceDetails && serviceDetails.lineItems.length > 0 && (
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">
                {formatCurrency(serviceDetails.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>VAT (5%):</span>
              <span className="font-medium">
                {formatCurrency(serviceDetails.vatAmount)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t">
              <span>Net Total:</span>
              <span>{formatCurrency(serviceDetails.netTotal)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
