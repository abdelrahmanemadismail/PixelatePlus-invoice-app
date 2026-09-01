'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useInvoiceState } from '@/lib/useURLState';
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { LineItem } from '@/types/invoice';

export function LineItemManager() {
  const { serviceDetails, addLineItem, removeLineItem, updateLineItem, setDiscount } = useInvoiceState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LineItem | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    subDescriptions: '',
    unitPrice: '',
    quantity: '1',
    vatRate: '5',
  });

  const resetForm = () => {
    setFormData({
      description: '',
      subDescriptions: '',
      unitPrice: '',
      quantity: '1',
      vatRate: '5',
    });
    setEditingItem(null);
  };

  const handleAdd = () => {
    if (!formData.description) return;

    const subDescArray = formData.subDescriptions
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const vatRateNum = formData.vatRate !== '' ? parseFloat(formData.vatRate) : 5;

    addLineItem({
      description: formData.description,
      subDescriptions: subDescArray,
      unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : undefined,
      quantity: parseInt(formData.quantity) || 1,
      vatRate: isNaN(vatRateNum) ? 5 : vatRateNum,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (item: LineItem) => {
    setEditingItem(item);
    setFormData({
      description: item.description,
      subDescriptions: item.subDescriptions.join('\n'),
      unitPrice: item.unitPrice !== undefined ? item.unitPrice.toString() : '',
      quantity: item.quantity.toString(),
      vatRate: item.vatRate !== undefined ? item.vatRate.toString() : '5',
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingItem || !formData.description) return;

    const subDescArray = formData.subDescriptions
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const vatRateNum = formData.vatRate !== '' ? parseFloat(formData.vatRate) : 5;

    updateLineItem(editingItem.id, {
      description: formData.description,
      subDescriptions: subDescArray,
      unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : undefined,
      quantity: parseInt(formData.quantity) || 1,
      vatRate: isNaN(vatRateNum) ? 5 : vatRateNum,
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

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === 0) return '';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Line Items</h3>
          <p className="text-xs text-muted-foreground">Manage items, unit prices, and per-item VAT rates</p>
        </div>
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
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="unitPrice">Unit Price (AED)</Label>
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
                <div className="grid gap-2">
                  <Label htmlFor="vatRate">VAT Rate (%)</Label>
                  <Input
                    id="vatRate"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="5"
                    value={formData.vatRate}
                    onChange={(e) =>
                      setFormData({ ...formData, vatRate: e.target.value })
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
                disabled={!formData.description}
              >
                {editingItem ? 'Update' : 'Add'} Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {serviceDetails && serviceDetails.lineItems.length > 0 ? (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-64">Description</TableHead>
                <TableHead className="text-right whitespace-nowrap">Unit</TableHead>
                <TableHead className="text-right whitespace-nowrap">Qty</TableHead>
                <TableHead className="text-right whitespace-nowrap">Taxable Total</TableHead>
                <TableHead className="text-center whitespace-nowrap">VAT Rate</TableHead>
                <TableHead className="text-right whitespace-nowrap">VAT</TableHead>
                <TableHead className="text-right whitespace-nowrap">Total Amount</TableHead>
                <TableHead className="w-20 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceDetails.lineItems.map((item) => {
                const hasPrice = item.unitPrice !== undefined && item.unitPrice > 0;
                const taxableTotal = item.taxableTotal ?? (hasPrice ? (item.unitPrice! * item.quantity) : 0);
                const vatRate = item.vatRate !== undefined ? item.vatRate : 5;
                const vatAmount = item.vatAmount ?? (taxableTotal * (vatRate / 100));
                const totalAmount = item.total ?? (taxableTotal + vatAmount);

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{item.description}</div>
                        {item.subDescriptions.length > 0 && (
                          <ul className="mt-1 text-xs text-muted-foreground list-disc list-inside">
                            {item.subDescriptions.map((sub, idx) => (
                              <li key={idx}>{sub}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap text-xs">
                      {hasPrice ? formatCurrency(item.unitPrice) : ''}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {hasPrice ? item.quantity : ''}
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap text-xs">
                      {taxableTotal > 0 ? formatCurrency(taxableTotal) : ''}
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground whitespace-nowrap">
                      {hasPrice ? `${vatRate}%` : ''}
                    </TableCell>
                    <TableCell className="text-right text-xs whitespace-nowrap text-muted-foreground">
                      {vatAmount > 0 ? formatCurrency(vatAmount) : ''}
                    </TableCell>
                    <TableCell className="text-right font-semibold whitespace-nowrap text-xs">
                      {totalAmount > 0 ? formatCurrency(totalAmount) : ''}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted/70 font-semibold border-t-2">
                <TableCell className="font-bold text-sm">
                  Total Cost
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-bold text-xs whitespace-nowrap">
                  {serviceDetails.subtotal > 0 ? (formatCurrency(serviceDetails.subtotal) || 'AED 0.00') : ''}
                </TableCell>
                <TableCell className="text-center font-bold text-xs text-muted-foreground whitespace-nowrap">
                  {serviceDetails.subtotal > 0 ? `${serviceDetails.vatPercentage || 5}%` : ''}
                </TableCell>
                <TableCell className="text-right font-bold text-xs whitespace-nowrap">
                  {serviceDetails.vatAmount > 0 ? (formatCurrency(serviceDetails.vatAmount) || 'AED 0.00') : ''}
                </TableCell>
                <TableCell className="text-right font-bold text-xs whitespace-nowrap text-primary">
                  {serviceDetails.netTotal > 0 ? (formatCurrency(serviceDetails.netTotal) || 'AED 0.00') : ''}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p>No line items added yet. Click &quot;Add Item&quot; to get started.</p>
        </div>
      )}

      {serviceDetails && serviceDetails.lineItems.length > 0 && (
        <div className="flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal (Taxable):</span>
              <span className="font-medium">
                {formatCurrency(serviceDetails.subtotal) || 'AED 0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Discount:</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-24 h-8 text-right text-xs"
                value={serviceDetails.discount || ''}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
            {serviceDetails.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">After Discount:</span>
                <span className="font-medium">
                  {formatCurrency(Math.max(0, serviceDetails.subtotal - serviceDetails.discount)) || 'AED 0.00'}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total VAT:</span>
              <span className="font-medium">
                {formatCurrency(serviceDetails.vatAmount) || 'AED 0.00'}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t">
              <span>Total Amount:</span>
              <span className="text-primary">{formatCurrency(serviceDetails.netTotal) || 'AED 0.00'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
