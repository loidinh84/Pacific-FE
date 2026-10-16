/**
 * PACIFIC ADMIN DEMO - Script tao tai khoan admin demo
 * 
 * Cach su dung: Mo browser console (F12) va paste doan nay vao,
 * hoac mo file nay trong browser.
 * 
 * Tai khoan tao ra:
 *   Username: Admin1
 *   Email: admin@pacific.org
 *   Role: admin
 */

(function createPacificAdminDemo() {
  const adminUser = {
    id: "admin-demo-001",
    username: "Admin1",
    email: "admin@pacific.org",
    role: "admin",
    fullName: "Quan tri vien Pacific",
    createdAt: new Date().toISOString(),
    isAdmin: true,
  };

  const adminToken = "demo-admin-token-" + Date.now();

  // Luu vao localStorage (ca hai key de tuong thich)
  localStorage.setItem("pacific_token", adminToken);
  localStorage.setItem("pacific_user", JSON.stringify(adminUser));
  localStorage.setItem("token", adminToken);
  localStorage.setItem("user", JSON.stringify(adminUser));

  // Phat su kien xac thuc de app React cap nhat
  window.dispatchEvent(new Event("pacific_auth_change"));

  console.log("%c PACIFIC ADMIN DEMO ", "background:#22d3ee;color:#0b1329;font-weight:bold;font-size:14px;padding:4px 8px;border-radius:4px;");
  console.log("%cTai khoan admin demo da duoc tao!", "color:#34d399;font-size:12px;");
  console.log("Username:", adminUser.username);
  console.log("Email:", adminUser.email);
  console.log("Role:", adminUser.role);
  console.log("%cChuyen den /admin/stats de xem dashboard.", "color:#818cf8;font-size:11px;");

  // Chuyen huong
  if (window.location) {
    setTimeout(() => { window.location.href = "/admin/stats"; }, 300);
  }
})();
