"use client";

import Input from "../input";
import Button from "../button";
import { UserData, useUser } from "@/lib/useUser";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

export default function AccountSettings() {
  const { data } = useUser();

  const [user, setUser] = useState<UserData>({
    name: "",
    lastName: "",
    email: "",
    profilePicture: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Sync fetched data into local state
  useEffect(() => {
    if (data) {
      setUser({
        name: data.name || "",
        lastName: data.lastName || "",
        email: data.email || "",
        profilePicture: data.profilePicture || "",
      });
    }
  }, [data]);

  const handleUserData = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (data) {
      setHasChanges(
        user.name !== data.name ||
          user.lastName !== data.lastName ||
          user.email !== data.email ||
          user.profilePicture !== data.profilePicture,
      );
    }

    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleProfilePicture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // preview image locally
    const imageUrl = URL.createObjectURL(file);

    setUser((prev) => ({
      ...prev,
      profilePicture: imageUrl,
    }));

    setHasChanges(true);

    // later you can upload the file to Firebase/S3/etc
    console.log(file);
  };

  const updateUserData = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data) return;

    // compare values
    if (!hasChanges) return;

    console.log("Updated user:", user);

    // replace with update logic
  };

  return (
    <section id="account">
      <div className="pb-2 mb-2 border-b border-[#404040]">
        <label className="text-2xl font-semibold">Account Settings</label>
      </div>

      <form onSubmit={updateUserData}>
        <label className="font-medium text-xl">Personal Information</label>
        <div className="grid gap-4 w-full">
          <div className="flex items-center gap-5 max-md:flex-col">
            <div
              title="Change profile picture"
              onClick={() => fileInputRef.current?.click()}
              className="relative h-full w-full max-w-50 max-h-50 aspect-square mt-2 group/profile-pic
                rounded-full text-white hover:outline-10 outline-white overflow-visible"
            >
              <div className="bg-[#191919] w-full h-full text-[5rem] font-bold flex items-center justify-center rounded-full overflow-hidden ">
                {user.profilePicture ? (
                  <>
                    <img
                      src={user.profilePicture}
                      className="w-full h-full absolute top-0 left-0 rounded-full group-hover/profile-pic:outline-5 outline-[#282828] object-center object-cover"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleProfilePicture}
                    />
                  </>
                ) : (
                  data && data.name && data.name[0]
                )}
              </div>
              <svg
                viewBox="0 0 20 19"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute w-10 right-0 bottom-0 overflow-visible"
              >
                <path
                  d="M10.0001 4.94002C9.01116 4.94002 8.04447 5.23326 7.22222 5.78267C6.39997 6.33208 5.75911 7.11297 5.38067 8.0266C5.00223 8.94023 4.90322 9.94557 5.09614 10.9155C5.28907 11.8854 5.76527 12.7763 6.46454 13.4756C7.1638 14.1748 8.05471 14.651 9.02462 14.8439C9.99452 15.0369 10.9999 14.9379 11.9135 14.5594C12.8271 14.181 13.608 13.5401 14.1574 12.7179C14.7068 11.8956 15.0001 10.9289 15.0001 9.94002C15.0001 8.61394 14.4733 7.34217 13.5356 6.40449C12.5979 5.4668 11.3262 4.94002 10.0001 4.94002ZM10.0001 12.94C9.40673 12.94 8.82671 12.7641 8.33336 12.4344C7.84001 12.1048 7.45549 11.6362 7.22843 11.0881C7.00137 10.5399 6.94196 9.93669 7.05771 9.35475C7.17347 8.7728 7.45919 8.23826 7.87875 7.8187C8.29831 7.39914 8.83286 7.11342 9.4148 6.99766C9.99674 6.88191 10.5999 6.94132 11.1481 7.16838C11.6963 7.39544 12.1648 7.77996 12.4945 8.27331C12.8241 8.76665 13.0001 9.34667 13.0001 9.94002C13.0001 10.7357 12.684 11.4987 12.1214 12.0613C11.5588 12.6239 10.7957 12.94 10.0001 12.94ZM19.1401 3.04002C18.8661 2.74669 18.5348 2.51278 18.1666 2.3528C17.7985 2.19283 17.4015 2.11019 17.0001 2.11002H15.8601C15.723 2.10958 15.5874 2.08094 15.4618 2.02589C15.3362 1.97084 15.2233 1.89056 15.1301 1.79002L13.7301 0.310019C13.636 0.211296 13.5227 0.132867 13.3971 0.0795557C13.2716 0.0262443 13.1365 -0.000822815 13.0001 1.90517e-05H7.00007C6.86368 -0.000822815 6.72856 0.0262443 6.60302 0.0795557C6.47748 0.132867 6.36418 0.211296 6.27007 0.310019L4.87007 1.79002C4.77683 1.89056 4.66391 1.97084 4.53833 2.02589C4.41275 2.08094 4.27719 2.10958 4.14007 2.11002H3.00007C2.59869 2.11019 2.20162 2.19283 1.8335 2.3528C1.46538 2.51278 1.13405 2.74669 0.86007 3.04002C0.302814 3.62847 -0.00533599 4.4096 6.9943e-05 5.22002V15.77C-0.00275663 16.577 0.30521 17.3541 0.86007 17.94C1.13165 18.2371 1.46229 18.4741 1.8308 18.636C2.19931 18.7979 2.59757 18.881 3.00007 18.88H17.0001C17.4026 18.881 17.8008 18.7979 18.1693 18.636C18.5379 18.4741 18.8685 18.2371 19.1401 17.94C19.6949 17.3541 20.0029 16.577 20.0001 15.77V5.22002C20.0055 4.4096 19.6973 3.62847 19.1401 3.04002ZM18.0001 15.77C18.0054 16.0699 17.8942 16.3603 17.6901 16.58C17.6023 16.6753 17.4956 16.7513 17.3768 16.8029C17.2579 16.8546 17.1296 16.8808 17.0001 16.88H3.00007C2.87051 16.8808 2.7422 16.8546 2.62338 16.8029C2.50455 16.7513 2.39784 16.6753 2.31007 16.58C2.10589 16.3603 1.99478 16.0699 2.00007 15.77V5.22002C1.99478 4.92009 2.10589 4.62978 2.31007 4.41002C2.39784 4.31471 2.50455 4.23879 2.62338 4.18713C2.7422 4.13546 2.87051 4.1092 3.00007 4.11002H4.14007C4.54828 4.10989 4.95216 4.02646 5.32701 3.86483C5.70185 3.7032 6.03977 3.46677 6.32007 3.17002L7.43007 2.00002H12.5701L13.6801 3.17002L14.4101 2.48002L13.6801 3.17002C13.9604 3.46677 14.2983 3.7032 14.6731 3.86483C15.048 4.02646 15.4519 4.10989 15.8601 4.11002H17.0001C17.1296 4.1092 17.2579 4.13546 17.3768 4.18713C17.4956 4.23879 17.6023 4.31471 17.6901 4.41002C17.8942 4.62978 18.0054 4.92009 18.0001 5.22002V15.77Z"
                  stroke="#282828"
                  strokeWidth="5"
                />
                <path
                  d="M10.0001 4.94002C9.01116 4.94002 8.04447 5.23326 7.22222 5.78267C6.39997 6.33208 5.75911 7.11297 5.38067 8.0266C5.00223 8.94023 4.90322 9.94557 5.09614 10.9155C5.28907 11.8854 5.76527 12.7763 6.46454 13.4756C7.1638 14.1748 8.05471 14.651 9.02462 14.8439C9.99452 15.0369 10.9999 14.9379 11.9135 14.5594C12.8271 14.181 13.608 13.5401 14.1574 12.7179C14.7068 11.8956 15.0001 10.9289 15.0001 9.94002C15.0001 8.61394 14.4733 7.34217 13.5356 6.40449C12.5979 5.4668 11.3262 4.94002 10.0001 4.94002ZM10.0001 12.94C9.40673 12.94 8.82671 12.7641 8.33336 12.4344C7.84001 12.1048 7.45549 11.6362 7.22843 11.0881C7.00137 10.5399 6.94196 9.93669 7.05771 9.35475C7.17347 8.7728 7.45919 8.23826 7.87875 7.8187C8.29831 7.39914 8.83286 7.11342 9.4148 6.99766C9.99674 6.88191 10.5999 6.94132 11.1481 7.16838C11.6963 7.39544 12.1648 7.77996 12.4945 8.27331C12.8241 8.76665 13.0001 9.34667 13.0001 9.94002C13.0001 10.7357 12.684 11.4987 12.1214 12.0613C11.5588 12.6239 10.7957 12.94 10.0001 12.94ZM19.1401 3.04002C18.8661 2.74669 18.5348 2.51278 18.1666 2.3528C17.7985 2.19283 17.4015 2.11019 17.0001 2.11002H15.8601C15.723 2.10958 15.5874 2.08094 15.4618 2.02589C15.3362 1.97084 15.2233 1.89056 15.1301 1.79002L13.7301 0.310019C13.636 0.211296 13.5227 0.132867 13.3971 0.0795557C13.2716 0.0262443 13.1365 -0.000822815 13.0001 1.90517e-05H7.00007C6.86368 -0.000822815 6.72856 0.0262443 6.60302 0.0795557C6.47748 0.132867 6.36418 0.211296 6.27007 0.310019L4.87007 1.79002C4.77683 1.89056 4.66391 1.97084 4.53833 2.02589C4.41275 2.08094 4.27719 2.10958 4.14007 2.11002H3.00007C2.59869 2.11019 2.20162 2.19283 1.8335 2.3528C1.46538 2.51278 1.13405 2.74669 0.86007 3.04002C0.302814 3.62847 -0.00533599 4.4096 6.9943e-05 5.22002V15.77C-0.00275663 16.577 0.30521 17.3541 0.86007 17.94C1.13165 18.2371 1.46229 18.4741 1.8308 18.636C2.19931 18.7979 2.59757 18.881 3.00007 18.88H17.0001C17.4026 18.881 17.8008 18.7979 18.1693 18.636C18.5379 18.4741 18.8685 18.2371 19.1401 17.94C19.6949 17.3541 20.0029 16.577 20.0001 15.77V5.22002C20.0055 4.4096 19.6973 3.62847 19.1401 3.04002ZM18.0001 15.77C18.0054 16.0699 17.8942 16.3603 17.6901 16.58C17.6023 16.6753 17.4956 16.7513 17.3768 16.8029C17.2579 16.8546 17.1296 16.8808 17.0001 16.88H3.00007C2.87051 16.8808 2.7422 16.8546 2.62338 16.8029C2.50455 16.7513 2.39784 16.6753 2.31007 16.58C2.10589 16.3603 1.99478 16.0699 2.00007 15.77V5.22002C1.99478 4.92009 2.10589 4.62978 2.31007 4.41002C2.39784 4.31471 2.50455 4.23879 2.62338 4.18713C2.7422 4.13546 2.87051 4.1092 3.00007 4.11002H4.14007C4.54828 4.10989 4.95216 4.02646 5.32701 3.86483C5.70185 3.7032 6.03977 3.46677 6.32007 3.17002L7.43007 2.00002H12.5701L13.6801 3.17002L14.4101 2.48002L13.6801 3.17002C13.9604 3.46677 14.2983 3.7032 14.6731 3.86483C15.048 4.02646 15.4519 4.10989 15.8601 4.11002H17.0001C17.1296 4.1092 17.2579 4.13546 17.3768 4.18713C17.4956 4.23879 17.6023 4.31471 17.6901 4.41002C17.8942 4.62978 18.0054 4.92009 18.0001 5.22002V15.77Z"
                  fill="white"
                />
              </svg>
            </div>
            <p>
              <strong className="font-semibold">Profile Image</strong>
              <br /> The proposed size is 512*512 px no bigger than 2.5 MB
            </p>
          </div>
          <div className="md:w-1/2 sm:w-2/3 grid gap-4">
            <Input
              id="name"
              placeholder="Name"
              value={user.name}
              example="John"
              required
              onChange={handleUserData}
            />

            <Input
              id="lastName"
              placeholder="Last Name"
              value={user.lastName}
              example="Doe"
              onChange={handleUserData}
            />

            <Input
              id="email"
              placeholder="Email"
              value={user.email}
              example="user@interactiveworkers.com"
              onChange={handleUserData}
            />
          </div>
        </div>

        <div className="flex sm:gap-4 max-sm:flex-col">
          <Button type="submit" disabled={!hasChanges}>
            Save
          </Button>

          <Button type="button" dark>
            Logout
          </Button>
        </div>
      </form>
    </section>
  );
}
