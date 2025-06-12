"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function DropMenu() {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5">
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <Link href='/'><DropdownMenuRadioItem value="top">N5 Kanji</DropdownMenuRadioItem></Link>
          <Link href='/n5/vocab'><DropdownMenuRadioItem value="n5vocab">N5 Vocabulary</DropdownMenuRadioItem></Link>
          <Link href='/n4/vocab'><DropdownMenuRadioItem value="n4vocab">N4 Vocabulary</DropdownMenuRadioItem></Link>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
