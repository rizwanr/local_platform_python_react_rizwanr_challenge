import * as LabelPrimitive from '@radix-ui/react-label';
import React from 'react';
import {
  useController,
  Control,
  FieldValues,
  FieldPath,
} from 'react-hook-form';
import { Input } from './Input';
import { cn } from '@/lib/utils';

interface FieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  type?: string;
  options?: { value: string; label: string }[]; // For select fields
  as?: 'input' | 'select'; // Determines whether to render an input or select
  className?: string;
  description?: string; // Optional description for the field
}

export const Field = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  options,
  as = 'input',
  className,
  description,
}: FieldProps<TFieldValues, TName>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const fieldId = `${name}-field`;
  const descriptionId = description ? `${name}-description` : undefined;
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="space-y-2">
      <LabelPrimitive.Root
        htmlFor={fieldId}
        className={cn(
          'block text-sm font-bold',
          error && 'text-destructive' // Change label color if there's an error
        )}
      >
        {label}
      </LabelPrimitive.Root>
      {as === 'input' && (
        <Input
          id={fieldId}
          placeholder={placeholder}
          type={type}
          className={cn(
            'w-full rounded-md border border-gray-300 p-2 placeholder:text-gray-400',
            className
          )}
          aria-describedby={cn(descriptionId, errorId)}
          aria-invalid={!!error}
          {...field}
        />
      )}
      {as === 'select' && options && (
        <select
          id={fieldId}
          className={cn(
            'w-full rounded-md border border-gray-300 bg-white p-2 text-sm',
            className
          )}
          aria-describedby={cn(descriptionId, errorId)}
          aria-invalid={!!error}
          {...field}
        >
          <option value="" disabled>
            {placeholder || 'Select an option'}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Field;
