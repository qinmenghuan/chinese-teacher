import SideNav from '@/app/ui/dashboard/sidenav';
import Header from '@/app/ui/base/Header';

export const experimental_ppr  = true;
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="">
        <Header />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}