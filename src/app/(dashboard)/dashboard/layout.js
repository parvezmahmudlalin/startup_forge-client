import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function RootLayout({children}) {
    return (
        <div className = "min-h-screen bg-gray-50">

        {/* sidebar */}

           <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </div>
        
        {/* Navigation Menu */}
        <DashboardSidebar/>
      </aside>

       {/* Main Content Area */}
      <div className="ml-64">
        {/* Navbar */}
        
            <DashboardNavbar/>
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

        </div>
  
    )
}