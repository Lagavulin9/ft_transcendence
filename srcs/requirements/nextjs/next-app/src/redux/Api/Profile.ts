import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReqUserDto, User } from "@/types/UserType";

export const ProfileApi = createApi({
  reducerPath: "ProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (builder) => ({
    getUser: builder.query<User, number>({
      query(userId: number) {
        return `http://localhost/api/user/${userId}`;
      },
      keepUnusedDataFor: 2,
    }),
    getProfile: builder.mutation<User, number>({
      query(userId: number) {
        return {
          url: `http://localhost/api/user/${userId}`,
          method: "GET",
        };
      },
    }),
    profileUpdate: builder.mutation<User, { user: ReqUserDto; uid: number }>({
      query({ user, uid }) {
        const requestBody = {
          nickname: user.nickname,
          isOTP: user.isOTP,
          profileURL: user.profileURL,
        };

        return {
          url: `http://localhost/api/user/${uid}`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        };
      },
    }),
    imageUpload: builder.mutation<string, FormData>({
      query(formData: FormData) {
        return {
          url: `http://localhost/api/image`,
          method: "POST",
          body: formData,
        };
      },
    }),
    checkNickname: builder.mutation<boolean, string>({
      query(nickname: string) {
        return `http://localhost/api/user/check/nick?nickname=${nickname}`;
      },
    }),
    checkOtpCode: builder.mutation<Boolean, number>({
      query(otpCode: number) {
        const req = {
          passcode: otpCode,
        };
        return {
          url: `http://localhost/api/auth/verify`,
          method: "POST",
          body: req,
        };
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProfileMutation,
  useProfileUpdateMutation,
  useCheckNicknameMutation,
  useImageUploadMutation,
  useCheckOtpCodeMutation,
} = ProfileApi;
