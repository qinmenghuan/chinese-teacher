'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const BlogFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1,{
    message: 'Please enter a title.',
  }),
  content: z.string().min(1,{
    message: 'Please enter a content.',
  }),

  date: z.string(),
});

const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1,{
    message: 'Please enter a name.',
  }),
  email: z.string().email({
    message: 'Please enter a email.',
  }),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message?: string | null;
};

export type BlogState = {
  errors?: {
    title?: string[];
    content?: string[];
  };
  message?: string | null;
};
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });


const CreateBlog = BlogFormSchema.omit({ id: true, date: true });
// Use Zod to update the expected types
const UpdateBlog = BlogFormSchema.omit({ id: true, date: true });

const CreateCustomer = CustomerFormSchema.omit({ id: true });
// Use Zod to update the expected types
const UpdateCustomer = CustomerFormSchema.omit({ id: true });
 
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    console.log('Validation errors:', errors);
    return {
      errors: errors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function createBlog(prevState: BlogState, formData: FormData) {
  // 获取当前登录用户的 session
  const session = await auth();
  console.log("Current session:", session);
  // 检查用户是否已登录
  if (!session?.user?.id) {
    return {
      message: 'Not authenticated. Please log in.',
    };
  }

  const validatedFields = CreateBlog.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    console.log('Validation errors:', errors);
    return {
      errors: errors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  const { title, content } = validatedFields.data;
  // const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  try {
    await sql`
      INSERT INTO blogs (user_id, title, content, status, date)
      VALUES (${session.user.id}, ${title}, ${content}, 'draft', ${date})
    `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Blog.',
    };
  }
 
  revalidatePath('/dashboard/blogs');
  redirect('/dashboard/blogs');
}

export async function createCustomer(prevState: CustomerState, formData: FormData) {
  console.log("createCustomer called", formData);
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  console.log("Validated Fields:", validatedFields);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    // TODO: flatten 学习
    const errors = validatedFields.error.flatten().fieldErrors;
    console.log('Validation errors:', errors);
    return {
      errors: errors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }
 
  const { name, email } = validatedFields.data;
 
  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, '/customers/evil-rabbit.png')
    `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }
 
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}


export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  console.log("formData in updateInvoice:", formData);
  // If form validation fails, return errors early. Otherwise, continue.
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    console.log('Validation errors:', errors);
    return {
      errors: errors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function updateBlog(id: string, prevState: BlogState, formData: FormData) {
  console.log("formData in updateBlog:", formData);
  // If form validation fails, return errors early. Otherwise, continue.
  const validatedFields = UpdateBlog.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    console.log('Validation errors:', errors);
    return {
      errors: errors,
      message: 'Missing Fields. Failed to Create Blog.',
    };
  }
 
  const { title, content } = validatedFields.data;
 
  try {
    await sql`
        UPDATE blogs
        SET title = ${title}, content = ${content}
        WHERE id = ${id}
      `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return { message: 'Database Error: Failed to Update Blog.' };
  }

  revalidatePath('/dashboard/blogs');
  redirect('/dashboard/blogs');
}


export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function deleteCustomer(id: string) {
  // throw new Error('Failed to Delete Invoice');
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath('/dashboard/customers');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function deleteBlog(id: string) {
  await sql`DELETE FROM blogs WHERE id = ${id}`;
  revalidatePath('/dashboard/blogs');
}
