"use client"

import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { SideBarOptions } from "@/services/Constants"
import {Plus} from "lucide-react"
import NextLink from "next/link"
import Link from "next/link";

  import Image from "next/image"
import { usePathname } from "next/navigation"
  
  export function AppSidebar() {

    const path = usePathname();
    console.log(path);

    return (
      <Sidebar>
        <SidebarHeader className="flex items-center mt-5">
            <Image src={'/react-logo.png'} alt="logo" width={200}
                height={180}
                className="w-[90px] h-[90px]"
                />

            <Button asChild className="w-full mt-5">
              <Link href="/dashboard/create-interview">
                <Plus className="mr-2" />
                Create New Interview
              </Link>
            </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarContent>
                <SidebarMenu>
                    {SideBarOptions.map((option, index)=>(
                        <SidebarMenuItem key={index} className='p-1'>
                            <SidebarMenuButton asChild className={`p-5 ${path==option.path && 'bg-blue-200'}`}>
                                <NextLink href={`https://ai-interviewer-nine-drab.vercel.app${option.path}`}>
                                    <option.icon className={`${path == option.path && 'text-primary'}`}/>
                                    {/* ${} is conditional styling to the particular tag we are workign on */}
                                    <span className={`text-[16px] ${path == option.path && 'text-primary'}`}>{option.name}</span>
                                </NextLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }