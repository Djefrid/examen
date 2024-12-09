"use client";
import AddMovie from '../../component/AddMovie';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Home() {
  return (
    <div className="">
      <main className="">
      

      <div className="">
      <AddMovie idAuteur={useParams().id} />
      
      </div>

      </main>
      
    </div>
  );
}
