import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  redirect('/auth');
  return null;
}
