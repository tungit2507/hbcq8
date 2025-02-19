import React from 'react';
import { CCard, CCardBody, CCol, CRow, CWidgetStatsA } from '@coreui/react';
import { CChartLine, CChartBar } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilPeople, cilBaby, cilSpeedometer, cilMoney } from '@coreui/icons';

const Dashboard = () => {
  // return (
  //   <>
  //     <CRow>
  //       <CCol sm={6} lg={3}>
  //         <CWidgetStatsA
  //           className="mb-4"
  //           color="primary"
  //           value="89.9%"
  //           title="Người dùng"
  //           action={
  //             <CIcon icon={cilPeople} height={24} />
  //           }
  //           chart={
  //             <CChartLine
  //               className="mt-3 mx-3"
  //               style={{ height: '70px' }}
  //               data={{
  //                 labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'],
  //                 datasets: [
  //                   {
  //                     label: 'Người dùng mới',
  //                     backgroundColor: 'transparent',
  //                     borderColor: 'rgba(255,255,255,.55)',
  //                     pointBackgroundColor: '#321fdb',
  //                     data: [65, 59, 84, 84, 51, 55, 40],
  //                   },
  //                 ],
  //               }}
  //               options={{
  //                 plugins: {
  //                   legend: {
  //                     display: false,
  //                   },
  //                 },
  //                 maintainAspectRatio: false,
  //                 scales: {
  //                   x: {
  //                     grid: {
  //                       display: false,
  //                       drawBorder: false,
  //                     },
  //                     ticks: {
  //                       display: false,
  //                     },
  //                   },
  //                   y: {
  //                     min: 30,
  //                     max: 89,
  //                     display: false,
  //                     grid: {
  //                       display: false,
  //                     },
  //                     ticks: {
  //                       display: false,
  //                     },
  //                   },
  //                 },
  //                 elements: {
  //                   line: {
  //                     borderWidth: 1,
  //                     tension: 0.4,
  //                   },
  //                   point: {
  //                     radius: 4,
  //                     hitRadius: 10,
  //                     hoverRadius: 4,
  //                   },
  //                 },
  //               }}
  //             />
  //           }
  //         />
  //       </CCol>
  //       <CCol sm={6} lg={3}>
  //         <CWidgetStatsA
  //           className="mb-4"
  //           color="info"
  //           value="140"
  //           title="Chim đua"
  //           action={
  //             <CIcon icon={cilBaby} height={24} />
  //           }
  //         />
  //       </CCol>
  //       <CCol sm={6} lg={3}>
  //         <CWidgetStatsA
  //           className="mb-4"
  //           color="warning"
  //           value="12"
  //           title="Giải đua"
  //           action={
  //             <CIcon icon={cilSpeedometer} height={24} />
  //           }
  //         />
  //       </CCol>
  //       <CCol sm={6} lg={3}>
  //         <CWidgetStatsA
  //           className="mb-4"
  //           color="danger"
  //           value="44.000.000đ"
  //           title="Doanh thu"
  //           action={
  //             <CIcon icon={cilMoney} height={24} />
  //           }
  //         />
  //       </CCol>
  //     </CRow>

  //     <CRow>
  //       <CCol xs={12} md={6} xl={6}>
  //         <CCard className="mb-4">
  //           <CCardBody>
  //             <h4 className="card-title mb-0">Thống kê người dùng</h4>
  //             <div className="small text-medium-emphasis">Tháng 1 - Tháng 6</div>
  //             <CChartBar
  //               data={{
  //                 labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
  //                 datasets: [
  //                   {
  //                     label: 'Người dùng mới',
  //                     backgroundColor: '#f87979',
  //                     data: [40, 20, 12, 39, 10, 40],
  //                   },
  //                 ],
  //               }}
  //               labels="months"
  //             />
  //           </CCardBody>
  //         </CCard>
  //       </CCol>
  //       <CCol xs={12} md={6} xl={6}>
  //         <CCard className="mb-4">
  //           <CCardBody>
  //             <h4 className="card-title mb-0">Thống kê doanh thu</h4>
  //             <div className="small text-medium-emphasis">Tháng 1 - Tháng 6</div>
  //             <CChartLine
  //               data={{
  //                 labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
  //                 datasets: [
  //                   {
  //                     label: 'Doanh thu',
  //                     backgroundColor: 'rgba(75,192,192,0.4)',
  //                     borderColor: 'rgba(75,192,192,1)',
  //                     pointBackgroundColor: 'rgba(75,192,192,1)',
  //                     pointBorderColor: '#fff',
  //                     data: [65, 59, 80, 81, 56, 55],
  //                   },
  //                 ],
  //               }}
  //             />
  //           </CCardBody>
  //         </CCard>
  //       </CCol>
  //     </CRow>
  //   </>
  // );
  return <>Tính năng đang phát triển</>  
};

export default Dashboard;