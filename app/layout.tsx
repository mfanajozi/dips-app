"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type React from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Avatar,
} from "@mui/material"
import { Menu as MenuIcon, Dashboard, Hotel, DirectionsBus, Restaurant, Build } from "@mui/icons-material"
import { supabase } from "@/lib/supabase"
import { ThemeProvider } from "@mui/material/styles"
import Link from "next/link"
import { theme } from "./theme"
import "./globals.css"

const navItems = [
  { text: "Dashboard", icon: <Dashboard />, href: "/" },
  { text: "Rooms", icon: <Hotel />, href: "/rooms" },
  { text: "Transportation", icon: <DirectionsBus />, href: "/transportation" },
  { text: "Catering", icon: <Restaurant />, href: "/catering" },
  { text: "Maintenance", icon: <Build />, href: "/maintenance" },
]

interface User {
  id: string;
  email?: string | null;
  user_metadata: {
    full_name?: string;
  } | null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        })
      }
    };
    getUser();
  }, []);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }
    setDrawerOpen(open)
  }

  const drawerContent = (
    <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            href={item.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <AppBar position="static">
            <Toolbar>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <img
                    src="/dipapa-logo.svg"
                    alt="Dipapa Logo"
                    style={{ 
                      height: '40px',
                      width: 'auto',
                      maxWidth: '120px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-logo.svg';
                    }}
                  />
                </Box>
                
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  DIPS ACCOMMODATION FACILITY MANAGEMENT SYSTEM
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    Hey {user?.user_metadata?.full_name || user?.email}
                  </Typography>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
                  </Avatar>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>
          <Container maxWidth={false} sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  )
}
