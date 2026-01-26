/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import { Edit, MapPin, Phone, Mail, CreditCard, FileText } from 'lucide-react';
import type { ClientInfo, ServiceDetails, TermsConditions, DocumentType } from '@/types/invoice';

interface PrintLayoutProps {
  documentType?: DocumentType;
  clientInfo: ClientInfo;
  serviceDetails: ServiceDetails;
  terms: TermsConditions;
  invoiceNumber: string;
  invoiceDate: string;
  validUntil: string;
  onEditSection?: (step: number) => void;
}

export function PrintLayout({
  documentType = 'invoice',
  clientInfo,
  serviceDetails,
  terms,
  invoiceNumber,
  invoiceDate,
  validUntil,
  onEditSection,
}: PrintLayoutProps) {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="print-layout bg-white min-h-[296mm] h-auto w-full mx-auto p-[15mm] md:p-12 text-slate-900 relative flex flex-col font-sans text-[10px]">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-slate-900"></div>

      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 mt-2">
        <div className="space-y-4">
          {/* Logo replaces text */}
          <img src="/logo.png" alt="Pixelate Plus" className="h-20 w-auto max-w-[200px] object-contain" />

          <div className="text-[9px] leading-relaxed text-slate-500 font-medium space-y-1.5">
            <div className="flex gap-4 ">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <p>+971 55 557 0449</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-slate-400" />
                <p>info@pixelateuae.com</p>
              </div>
            </div>
            <div className="flex gap-2">
              <MapPin className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p>Lootah Building, Floor 1 (A104), JVC</p>
                <p>Dubai, United Arab Emirates</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-[48px] font-black text-slate-200/80 tracking-tighter leading-[0.8] mb-4 select-none mr-2">
            {documentType === 'invoice' ? 'INVOICE' : 'INQUIRY'}
          </h2>
          <div className="inline-block text-left bg-white shadow-sm px-4 py-2.5 rounded-xl border border-slate-200 min-w-50">
            <div className="space-y-1.5">
              <div className="flex justify-between gap-8 text-[9px] items-center">
                <span className="text-slate-400 font-medium uppercase tracking-wider">
                  {documentType === 'invoice' ? 'Invoice #' : 'Ref #'}
                </span>
                <span className="font-bold font-mono text-slate-900 text-xs">{invoiceNumber}</span>
              </div>
              <div className="h-px bg-slate-100 my-1"></div>
              <div className="flex justify-between gap-8 text-[9px]">
                <span className="text-slate-400 font-medium">Date</span>
                <span className="font-semibold text-slate-700">{formatDate(invoiceDate)}</span>
              </div>
              <div className="flex justify-between gap-8 text-[9px]">
                <span className="text-slate-400 font-medium">
                  {documentType === 'invoice' ? 'Due Date' : 'Valid Until'}
                </span>
                <span className="font-semibold text-slate-700">{formatDate(validUntil)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information Section */}
      <div className="mb-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 bg-slate-50 rounded-xl p-4 border border-slate-200 relative group">
           {onEditSection && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 no-print opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={() => onEditSection(1)}
              >
                <Edit className="w-3 h-3 text-slate-400" />
              </Button>
            )}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Bill To
              </h3>
              <div className="text-slate-900 ml-3.5">
                <div className="text-base font-bold mb-1 tracking-tight">{clientInfo.companyName}</div>

                <div className="text-[10px] text-slate-600 space-y-0.5 mb-2">
                   {clientInfo.contactPerson && <div className="font-medium text-slate-800">{clientInfo.contactPerson}</div>}
                   {clientInfo.email && <div className="flex items-center gap-1.5 text-[9px]"><Mail className="w-2.5 h-2.5 text-slate-400"/> {clientInfo.email}</div>}
                   {clientInfo.phone && <div className="flex items-center gap-1.5 text-[9px]"><Phone className="w-2.5 h-2.5 text-slate-400"/> {clientInfo.phone}</div>}
                </div>

                {clientInfo.billingAddress && (
                  <div className="flex items-start gap-1.5 text-[9px] text-slate-500 max-w-lg mb-1 leading-relaxed">
                    <MapPin className="w-2.5 h-2.5 text-slate-400 mt-0.5 shrink-0"/>
                    {clientInfo.billingAddress}
                  </div>
                )}
              </div>
            </div>
             {clientInfo.trnNumber && (
               <div className="text-right bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                 <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tax Registration</div>
                 <div className="font-mono text-xs font-bold text-slate-700 tracking-wide">{clientInfo.trnNumber}</div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-4 grow">
        <div className="flex items-center justify-between mb-2">
           {onEditSection && (
            <Button
              variant="ghost"
              size="sm"
              className="no-print h-5 text-[10px] ml-auto"
              onClick={() => onEditSection(2)}
            >
              <Edit className="w-2.5 h-2.5 mr-1" />
              Edit Items
            </Button>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-[10px] box-border">
            <thead>
              <tr className="bg-slate-900 text-slate-50 border-b border-slate-900">
                <th className="py-1.5 px-4 text-left font-semibold w-[50%]">Description</th>
                <th className="py-1.5 px-4 text-right font-semibold">Unit Price</th>
                <th className="py-1.5 px-4 text-right font-semibold">Qty</th>
                <th className="py-1.5 px-4 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serviceDetails.lineItems.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} border-b border-slate-100 last:border-0`}>
                  <td className="py-1.5 px-4 align-top">
                    <div className="font-bold text-slate-800 text-[10px] mb-0.5">{item.description}</div>
                    {item.subDescriptions.length > 0 && (
                      <ul className="text-slate-500 space-y-0.5 list-none">
                        {item.subDescriptions.map((sub, idx) => (
                          <li key={idx} className="pl-0 before:content-['-'] before:mr-1 before:text-slate-300">
                            {sub}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="py-1.5 px-4 text-right font-medium text-slate-600 align-top whitespace-nowrap">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-1.5 px-4 text-right text-slate-600 align-top">
                    {item.quantity}
                  </td>
                  <td className="py-1.5 px-4 text-right font-bold text-slate-900 align-top whitespace-nowrap">
                    {item.total > 0 && formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Flexible Layout for Alignment */}
      <div className="flex flex-col gap-6 mt-0 break-inside-avoid">

        {/* Row 1: Terms/Payment vs Totals */}
        <div className="flex gap-10 items-start">
            {/* Left Box: Terms & Payment */}
            <div className="flex-1 space-y-4">
                {terms.additionalNotes && (
                    <div>
                        <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <FileText className="w-2.5 h-2.5 text-slate-300" />
                        Terms & Conditions
                        </h3>
                        <div className="text-[9px] text-slate-600 whitespace-pre-wrap leading-relaxed border-l-2 border-slate-200 pl-3 py-0.5">
                        {terms.additionalNotes}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <CreditCard className="w-2.5 h-2.5 text-slate-300" />
                        Payment Method
                    </h3>
                    <div className="flex flex-wrap gap-4 text-[9px] text-slate-700 ml-1">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 border border-slate-300 rounded-sm"></div>
                            <span>Bank Transfer</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 border border-slate-300 rounded-sm"></div>
                            <span>Manager Cheque</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 border border-slate-300 rounded-sm"></div>
                            <span>Credit Card Link</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Box: Totals (Aligned Top) */}
            <div className="w-80 shrink-0">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 shadow-sm">
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] items-center">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="font-bold text-slate-700 text-sm">{formatCurrency(serviceDetails.subtotal)}</span>
                    </div>
                    {serviceDetails.discount > 0 && (
                      <div className="flex justify-between text-[10px] items-center text-red-600">
                        <span className="font-medium">Discount</span>
                        <span className="font-bold text-sm">-{formatCurrency(serviceDetails.discount)}</span>
                      </div>
                    )}
                    {serviceDetails.vatAmount > 0 && (
                      <div className="flex justify-between text-[10px] items-center">
                        <span className="text-slate-500 font-medium">VAT ({serviceDetails.vatPercentage}%)</span>
                        <span className="font-bold text-slate-700 text-sm">{formatCurrency(serviceDetails.vatAmount)}</span>
                      </div>
                    )}
                    <div className="my-2 border-t-2 border-slate-200 border-dashed"></div>
                    <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight mb-1">Total Payable</span>
                    <span className="text-xl font-black text-slate-900 leading-none">{formatCurrency(serviceDetails.netTotal)}</span>
                    </div>
                </div>
                </div>
            </div>
        </div>

        {/* Row 2: Bank Details vs Customer Approval (Aligned Bottom) */}
        <div className="flex gap-10 items-end">
            {/* Left: Bank Details */}
            <div className="flex-1">
                <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Bank Details</h3>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-[9px] max-w-sm">
                    <div className="grid grid-cols-[60px_1fr] gap-y-0.5">
                        <span className="text-slate-500">Bank:</span>
                        <span className="font-semibold text-slate-900">{terms.bankName}</span>

                        <span className="text-slate-500">Acc. Name:</span>
                        <span className="font-semibold text-slate-900">{terms.accountName}</span>

                        <span className="text-slate-500">Acc. No.:</span>
                        <span className="font-semibold text-slate-900">{terms.accountNumber}</span>

                        <span className="text-slate-500">IBAN:</span>
                        <span className="font-mono text-slate-900 tracking-tight">{terms.iban}</span>
                    </div>
                </div>
                {onEditSection && (
                    <div className="no-print pt-2">
                        <Button variant="ghost" size="sm" onClick={() => onEditSection(3)} className="h-6 text-xs text-slate-400">
                            <Edit className="w-3 h-3 mr-1" /> Edit Bottom Section
                        </Button>
                    </div>
                )}
            </div>

            {/* Right: Customer Approval */}
            <div className="w-80 shrink-0">
                <h3 className="font-bold text-slate-900 text-[10px] mb-1.5">Customer Approval</h3>
                <p className="text-slate-500 text-[8px] leading-tight mb-6">
                    By signing, I accept the Terms & Conditions. Please sign, stamp and email to info@pixelateuae.com
                </p>
                <div className="border-t border-slate-300 w-full pt-1.5 text-center">
                    <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Authorised Signature & Stamp</p>
                </div>
            </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-4 text-center border-t border-slate-100 pt-2">
        <p className="text-slate-400 text-[9px] font-semibold uppercase tracking-[0.2em]">Thank you for your business</p>
      </div>
    </div>
  );
}


