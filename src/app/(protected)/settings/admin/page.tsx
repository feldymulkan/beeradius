"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { EditFormSkeleton } from "@/components/Skleton";

// Updated schema for profile (only username)
const profileSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
});

// Password schema remains the same
const passwordSchema = z.object({
    currentPassword: z.string().min(6, "Password minimal 6 karakter"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AdminSettingsPage() {
    const [isFetching, setIsFetching] = useState(true);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue,
        formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                if (!res.ok) throw new Error("Gagal memuat data admin.");
                const data = await res.json();
                setValue("username", data.username); // Set the username value
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsFetching(false);
            }
        };
        fetchAdminData();
    }, [setValue]);

    const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            toast.success(result.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };
    
    const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            toast.success(result.message);
            resetPasswordForm();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (isFetching) {
        return <EditFormSkeleton />;
    }

    return (
        <div className="prose lg:prose-xl">
            <h1>Pengaturan Admin</h1>
            <div className="not-prose space-y-8">
                {/* --- KARTU EDIT PROFIL --- */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Edit Profil</h2>
                        <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                            <div className="form-control">
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Username</legend>
                                    <input type="text" {...registerProfile("username")} className={`input input-bordered ${profileErrors.username ? "input-error" : ""}`} />
                                    {profileErrors.username && <span className="text-error text-sm mt-1">{profileErrors.username.message}</span>}
                                </fieldset>
                                
                                
                            </div>
                            <div className="card-actions justify-end">
                                <button type="submit" className="btn btn-primary" disabled={isSubmittingProfile}>
                                    {isSubmittingProfile && <span className="loading loading-spinner"></span>}
                                    Simpan Profil
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- KARTU UBAH PASSWORD --- */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Ubah Password</h2>
                        <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                            <div className="form-control">
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Password Lama</legend>
                                    <input type="password" {...registerPassword("currentPassword")} className={`input input-bordered ${passwordErrors.currentPassword ? "input-error" : ""}`} placeholder="Current Password" />
                                        {passwordErrors.currentPassword && <span className="text-error text-sm mt-1">{passwordErrors.currentPassword.message}</span>}       
                                    
                                </fieldset>
                                {/* <label className="label"><span className="label-text">Password Saat Ini</span></label> */}
                                
                            </div>
                            <div className="form-control">
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Password Baru</legend>
                                    <input type="password" {...registerPassword("newPassword")} className={`input input-bordered ${passwordErrors.newPassword ? "input-error" : ""}`} placeholder="New Password" />
                                          {passwordErrors.newPassword && <span className="text-error text-sm mt-1">{passwordErrors.newPassword.message}</span>}   
                               
                                </fieldset>
                                
                            </div>
                            <div className="card-actions justify-end">
                                <button type="submit" className="btn btn-primary" disabled={isSubmittingPassword}>
                                    {isSubmittingPassword && <span className="loading loading-spinner"></span>}
                                    Ubah Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}