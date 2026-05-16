import { Route, Routes } from "react-router-dom";
import { Clinicbrowses } from "../page/Clinicbrowse/Clinicbrowses";
import { Detailclinicbrowse } from "../page/Detailclinicbrowse/Detailclinicbrowse";
import { Doctorbrowses } from "../page/Doctorbrowse/Doctorbrowses";
import { Clinicmanagers } from "../page/Clinicmanager/Clinicmanagers";
import { Alllistpackages } from "../page/package/listpackage/Alllistpackages";
import { Detaildoctor } from "../page/Detaildoctor/Detaildoctor";
import { Detailmanager } from "../page/Detailmanager/Detailmanager";
import { Createpackage } from "../page/package/createpackage/Createpackage";
import { Fixclinic } from "../page/Fixclinic/Fixclinic";
import { Detailpackage } from "../page/package/Detailpackage/Detailpackage";
import { Fixpackage } from "../page/package/Fixpackage/Fixpackage";
import { Changepassword } from "../page/Changepassword/Changepassword";
import { UserProfile } from "../page/profile/Userprofile";
import Statistical from "../page/statistical/Statistical";
import SidebarAdmin from "../layouts/LayoutSystem/Sidebar/SidebarSystem";

function Routing() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <SidebarAdmin>
            <Statistical />
          </SidebarAdmin>
        }
      />
      <Route path="/account/userprofile" element={<UserProfile />} />
      <Route path="/duyet-phong-kham" element={<Clinicbrowses />} />
      <Route
        path="/duyet-phong-kham/thong-tin-phong-kham/:id"
        element={<Detailclinicbrowse />}
      />
      <Route path="/duyet-bac-si" element={<Doctorbrowses />} />
      <Route
        path="/duyet-bac-si/thong-tin-bac-si/:id"
        element={<Detaildoctor />}
      />
      <Route path="/quan-ly-phong-kham" element={<Clinicmanagers />} />
      <Route
        path="/quan-ly-phong-kham/thong-tin-phong-kham/:id"
        element={<Detailmanager />}
      />
      <Route
        path="/quan-ly-phong-kham/sua-thong-tin-phong-kham/:id"
        element={<Fixclinic />}
      />
      <Route path="/quan-ly-goi/tao-goi" element={<Createpackage />} />
      <Route path="/quan-ly-goi/danh-sach-goi" element={<Alllistpackages />} />
      <Route
        path="/quan-ly-goi/danh-sach-goi/thong-tin-goi/:id"
        element={<Detailpackage />}
      />
      <Route
        path="/quan-ly-goi/danh-sach-goi/sua-thong-tin-goi/:id"
        element={<Fixpackage />}
      />
      <Route path="/thong-ke-bao-cao/tong-quan" element={<Statistical />} />
      <Route
        path="/thong-ke-bao-cao/thong-ke-doanh-thu"
        element={<div>Revenue Statistics</div>}
      />
      <Route path="/doi-mat-khau" element={<Changepassword />} />
      <Route path="/login" element={<div></div>} />
    </Routes>
  );
}
export { Routing };
