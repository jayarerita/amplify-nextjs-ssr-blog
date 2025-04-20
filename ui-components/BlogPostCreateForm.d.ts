import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type BlogPostCreateFormInputValues = {
    slug?: string;
    title?: string;
    excerpt?: string;
    coverImage?: string;
    status?: string;
    publishedAt?: string;
    tags?: string[];
};
export declare type BlogPostCreateFormValidationValues = {
    slug?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    excerpt?: ValidationFunction<string>;
    coverImage?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    publishedAt?: ValidationFunction<string>;
    tags?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BlogPostCreateFormOverridesProps = {
    BlogPostCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    slug?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    excerpt?: PrimitiveOverrideProps<TextFieldProps>;
    coverImage?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<SelectFieldProps>;
    publishedAt?: PrimitiveOverrideProps<TextFieldProps>;
    tags?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BlogPostCreateFormProps = React.PropsWithChildren<{
    overrides?: BlogPostCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: BlogPostCreateFormInputValues) => BlogPostCreateFormInputValues;
    onSuccess?: (fields: BlogPostCreateFormInputValues) => void;
    onError?: (fields: BlogPostCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BlogPostCreateFormInputValues) => BlogPostCreateFormInputValues;
    onValidate?: BlogPostCreateFormValidationValues;
} & React.CSSProperties>;
export default function BlogPostCreateForm(props: BlogPostCreateFormProps): React.ReactElement;
