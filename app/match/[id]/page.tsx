import { Suspense } from 'react';

interface Props {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function MatchDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    </Suspense>
  );
}