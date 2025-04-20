import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { BlogPost } from "./graphql/types";
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
export declare type BlogPostUpdateFormInputValues = {
    slug?: string;
    title?: string;
    excerpt?: string;
    coverImage?: string;
    status?: string;
    publishedAt?: string;
    tags?: string[];
};
export declare type BlogPostUpdateFormValidationValues = {
    slug?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    excerpt?: ValidationFunction<string>;
    coverImage?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    publishedAt?: ValidationFunction<string>;
    tags?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BlogPostUpdateFormOverridesProps = {
    BlogPostUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    slug?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    excerpt?: PrimitiveOverrideProps<TextFieldProps>;
    coverImage?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<SelectFieldProps>;
    publishedAt?: PrimitiveOverrideProps<TextFieldProps>;
    tags?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BlogPostUpdateFormProps = React.PropsWithChildren<{
    overrides?: BlogPostUpdateFormOverridesProps | undefined | null;
} & {
    slug?: string;
    blogPost?: BlogPost;
    onSubmit?: (fields: BlogPostUpdateFormInputValues) => BlogPostUpdateFormInputValues;
    onSuccess?: (fields: BlogPostUpdateFormInputValues) => void;
    onError?: (fields: BlogPostUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BlogPostUpdateFormInputValues) => BlogPostUpdateFormInputValues;
    onValidate?: BlogPostUpdateFormValidationValues;
} & React.CSSProperties>;
export default function BlogPostUpdateForm(props: BlogPostUpdateFormProps): React.ReactElement;
