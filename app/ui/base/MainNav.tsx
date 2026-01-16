"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const products = [
  { title: "编辑器", href: "/products/editor", description: "高效的在线代码编辑体验。" },
  { title: "分析面板", href: "/products/analytics", description: "实时查看业务增长数据。" },
]

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        
        {/* 下拉菜单示例 */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resource</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              {products.map((item) => (
                <ListItem 
                  key={item.title} 
                  title={item.title} 
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* 单个链接示例：修复了 <a> 嵌套问题 */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/pricing">
              价格
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  )
}

/**
 * 修复后的 ListItem 组件
 * 1. 使用 React.ComponentPropsWithoutRef<typeof Link> 确保属性兼容
 * 2. NavigationMenuLink 配合 asChild，内部直接写 Link
 * 3. 彻底移除手动编写的 <a> 标签
 */
const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"