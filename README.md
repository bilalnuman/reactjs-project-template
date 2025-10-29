This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



<!-- 'use client';
import { useAppStore } from '@/store/useAppStore';
import { selectCount, selectInc, selectTheme, selectToggleTheme } from '@/store/selectors';


export default function CounterClient() {
const count = useAppStore(selectCount);
const inc = useAppStore(selectInc);
const theme = useAppStore(selectTheme);
const toggleTheme = useAppStore(selectToggleTheme);


return (
<div className="space-y-2">
<div>Theme: <b>{theme}</b></div>
<button className="px-3 py-1 rounded bg-gray-200" onClick={() => toggleTheme()}>Toggle theme</button>


<div className="pt-4">Count: <b>{count}</b></div>
<div className="flex gap-2">
<button className="px-3 py-1 rounded bg-gray-200" onClick={() => inc(1)}>+1</button>
<button className="px-3 py-1 rounded bg-gray-200" onClick={() => inc(5)}>+5</button>
</div>
</div>
);
} -->