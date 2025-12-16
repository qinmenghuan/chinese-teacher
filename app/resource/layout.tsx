import SideNav from '@/app/ui/dashboard/sidenav';

export const experimental_ppr  = true;

 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="">
        header
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}