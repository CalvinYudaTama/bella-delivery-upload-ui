'use client';

import React from 'react';
import { useDeliveryContext } from './context/DeliveryContext';

export const DeliveryStatistics: React.FC = () => {
  const { state } = useDeliveryContext();
  const { statistics } = state;

  const stats = [
    {
      label: 'Images Delivered',
      value: `${statistics.imagesDelivered} Images`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <g clipPath="url(#clipImageDelivered)">
            <path
              d="M7.81192 23.1638C5.81076 23.1638 4.0307 21.8825 3.38432 19.975L3.3406 19.8312C3.18816 19.3261 3.1243 18.9013 3.1243 18.4762V9.95337L0.0917729 20.0761C-0.298251 21.5651 0.590519 23.1087 2.08172 23.52L21.411 28.6965C21.6523 28.759 21.8935 28.789 22.1311 28.789C23.376 28.789 24.5136 27.9627 24.8324 26.745L25.9586 23.1638H7.81192Z"
              fill="url(#paint0_imageDelivered)"
            />
            <path
              d="M11.2496 10.0386C12.6285 10.0386 13.7496 8.91729 13.7496 7.53847C13.7496 6.15965 12.6285 5.03833 11.2496 5.03833C9.87083 5.03833 8.74951 6.15965 8.74951 7.53847C8.74951 8.91729 9.87083 10.0386 11.2496 10.0386Z"
              fill="url(#paint1_imageDelivered)"
            />
            <path
              d="M26.875 1.28833H8.12451C6.40213 1.28833 4.99951 2.69095 4.99951 4.41356V18.1637C4.99951 19.8863 6.40213 21.289 8.12451 21.289H26.875C28.5976 21.289 30.0002 19.8863 30.0002 18.1637V4.41356C30.0002 2.69095 28.5976 1.28833 26.875 1.28833ZM8.12451 3.78847H26.875C27.2201 3.78847 27.5001 4.0684 27.5001 4.41356V13.2875L23.5513 8.67979C23.1324 8.1886 22.5261 7.92607 21.8749 7.91119C21.2274 7.91485 20.6199 8.20233 20.205 8.69993L15.5622 14.2724L14.0497 12.7636C13.1948 11.9087 11.8034 11.9087 10.9497 12.7636L7.49965 16.2125V4.41356C7.49965 4.0684 7.77958 3.78847 8.12451 3.78847Z"
              fill="url(#paint2_imageDelivered)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_imageDelivered"
              x1="12.9793"
              y1="9.95337"
              x2="12.9793"
              y2="28.789"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DEA751" />
              <stop offset="1" stopColor="#BC9353" />
            </linearGradient>
            <linearGradient
              id="paint1_imageDelivered"
              x1="11.2495"
              y1="5.03833"
              x2="11.2495"
              y2="10.0386"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DEA751" />
              <stop offset="1" stopColor="#BC9353" />
            </linearGradient>
            <linearGradient
              id="paint2_imageDelivered"
              x1="17.4999"
              y1="1.28833"
              x2="17.4999"
              y2="21.289"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DEA751" />
              <stop offset="1" stopColor="#BC9353" />
            </linearGradient>
            <clipPath id="clipImageDelivered">
              <rect width="30" height="30" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: 'Rooms Staged',
      value: `${statistics.roomsStaged} Rooms`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <g clipPath="url(#clipRoomsStaged)">
            <path
              d="M25.5882 12.4381C25.5882 12.0704 25.3601 11.7411 25.0157 11.612L20.604 9.95758C20.0271 9.74125 19.4118 10.1677 19.4118 10.7837V18.6788L15.8824 17.3433V5.87271L30 11.2145V22.6851L25.5882 21.0158V12.4381ZM23.8235 20.3481L21.1764 19.3465V12.0569L23.8235 13.0496V20.3481ZM14.1176 5.87271V17.3433L0 22.6851V11.2145L14.1176 5.87271ZM3.08824 17.5117C3.08824 18.1277 3.70359 18.5542 4.28039 18.3378L11.3392 15.6908C11.6837 15.5617 11.9118 15.2324 11.9118 14.8646V10.4529C11.9118 9.83682 11.2964 9.41037 10.7196 9.6267L3.66076 12.2738C3.31635 12.4029 3.08824 12.7322 3.08824 13.1V17.5117ZM29.0529 24.2136L15.3098 29.3672C15.11 29.4421 14.8899 29.4421 14.6902 29.3672L0.94705 24.2136L15 18.8962L29.0529 24.2136ZM14.1176 0.57666V4.10799L0 9.44981V6.48221C0 6.11442 0.228164 5.78518 0.572519 5.65603L14.1176 0.57666ZM15.8824 0.57666L29.4275 5.65603C29.7719 5.78518 30 6.11442 30 6.48221V9.44981L15.8824 4.10799V0.57666ZM4.85297 16.2384V13.7113L10.1471 11.7261V14.2531L4.85297 16.2384Z"
              fill="url(#paintRoomsStaged)"
            />
          </g>
          <defs>
            <linearGradient
              id="paintRoomsStaged"
              x1="15"
              y1="0.57666"
              x2="15"
              y2="29.4234"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DEA751" />
              <stop offset="1" stopColor="#BC9353" />
            </linearGradient>
            <clipPath id="clipRoomsStaged">
              <rect width="30" height="30" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: 'Total File Size',
      value: statistics.totalFileSize,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <g clipPath="url(#clipFileSize)">
            <path
              d="M29.7628 11.5871C29.6008 11.2947 29.3633 11.0512 29.075 10.8819C28.7868 10.7127 28.4583 10.624 28.1241 10.625H10.3577C9.75869 10.625 9.17584 10.8193 8.69664 11.1786C8.21743 11.538 7.86772 12.0432 7.7 12.6182L4.18344 24.675C3.99831 25.3097 3.61231 25.8672 3.08339 26.2639C2.55446 26.6606 1.91115 26.875 1.25 26.875H23.5924C24.2537 26.875 24.8971 26.6605 25.4261 26.2638C25.9552 25.867 26.3412 25.3093 26.5264 24.6745L29.9023 13.1006C29.9808 12.8517 30.0089 12.5897 29.985 12.3298C29.961 12.0699 29.8855 11.8175 29.7628 11.5871Z"
              fill="url(#paintFileSizeBody)"
            />
            <path
              d="M2.98125 24.325L6.5 12.2687C6.74514 11.4353 7.25297 10.7033 7.94786 10.1819C8.64274 9.66042 9.48748 9.37741 10.3562 9.375H26.25V8.75C26.25 8.08696 25.9866 7.45107 25.5178 6.98223C25.0489 6.51339 24.413 6.25 23.75 6.25H14.2223C14.0361 6.25 13.8522 6.20849 13.684 6.12848C13.5158 6.04848 13.3675 5.93199 13.25 5.7875L12.0214 4.27681C11.7288 3.91697 11.3596 3.62688 10.9407 3.42764C10.5218 3.22839 10.0638 3.12501 9.6 3.125H2.5C1.83696 3.125 1.20107 3.38839 0.732233 3.85723C0.263392 4.32607 0 4.96196 0 5.625L0 24.375C0 24.7065 0.131696 25.0245 0.366117 25.2589C0.600537 25.4933 0.918479 25.625 1.25 25.625C1.64016 25.6239 2.01952 25.4968 2.33151 25.2625C2.64351 25.0282 2.87141 24.6994 2.98125 24.325Z"
              fill="url(#paintFileSizeBase)"
            />
          </g>
          <defs>
            <linearGradient
              id="paintFileSizeBody"
              x1="15.6216"
              y1="10.625"
              x2="15.6216"
              y2="26.875"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DEA751" />
              <stop offset="1" stopColor="#BC9353" />
            </linearGradient>
            <linearGradient
              id="paintFileSizeBase"
              x1="13.125"
              y1="3.125"
              x2="13.125"
              y2="25.625"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DEA751" />
              <stop offset="1" stopColor="#BC9353" />
            </linearGradient>
            <clipPath id="clipFileSize">
              <rect width="30" height="30" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex min-w-[304px] flex-1 flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5"
        >
          {stat.icon && <div className="h-[30px] w-[30px] flex-shrink-0">{stat.icon}</div>}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold leading-5 text-[#535862]">{stat.label}</span>
            <p className="text-[30px] font-semibold leading-[38px] text-[#181D27]">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

