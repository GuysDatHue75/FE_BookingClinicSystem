import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../../api/api';

const LoginSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        
        const role = searchParams.get('role');
        console.log(role);  
        const idPatient = searchParams.get('idPatient');
        const idAccount = searchParams.get('idAccount')|| "";


        if (role && idPatient) {
            localStorage.setItem('role', role);
            localStorage.setItem('idPatient', idPatient);
            localStorage.setItem('idAccount', idAccount);
            const fetchUser = async () => {
                const res = await apiClient.get(`/api/v1/patient/${idPatient}`);
                localStorage.setItem('city', res.data?.queQuan || "");                
                if (Number(res.data?.taiKhoan.lanDauDangNhap) === 1) {
                    localStorage.setItem('idAccount', idAccount);
                    navigate('/chon-tinhthanh');
                } else {
                    navigate('/trang-chu');
                }

            };
            fetchUser();
        } else {
            navigate('/login?error=failed');
        }
    }, []);

    return <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>Đang xử lý đăng nhập...</div>;
};

export default LoginSuccess;