'use client';

import React, { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode | string;
    description?: ReactNode | string;
    children: ReactNode;
    footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
}) => {
    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                {/* Overlay */}
                <DialogPrimitive.Overlay
                    className={cn(
                        'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
                    )}
                />
                {/* Content */}
                <DialogPrimitive.Content
                    className={cn(
                        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg'
                    )}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        {title && (
                            <DialogPrimitive.Title
                                className={cn(
                                    typeof title === 'string' && 'text-lg font-semibold leading-none tracking-tight'
                                )}
                            >
                                {title}
                            </DialogPrimitive.Title>
                        )}
                        <DialogPrimitive.Close
                            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>
                    </div>
                    {/* Description */}
                    {description && (
                        <DialogPrimitive.Description
                            className={cn(
                                typeof description === 'string' && 'text-sm text-muted-foreground'
                            )}
                        >
                            {description}
                        </DialogPrimitive.Description>
                    )}
                    {/* Body */}
                    <div>{children}</div>
                    {/* Footer */}
                    {footer && <div className="flex justify-end space-x-2">{footer}</div>}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default Modal;