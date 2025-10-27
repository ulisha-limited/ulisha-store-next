import {
  AuthError,
  SupabaseClient,
  User,
  UserResponse,
} from "@supabase/supabase-js";

export default async function AuthUsersSeed(
  supabase: SupabaseClient<any, "public", any>,
): Promise<void> {
  const users = [
    {
      email: "admin@gmail.com",
      password: "admin1234",
      full_name: "Admin User",
      role: "admin",
    },
    {
      email: "user@gmail.com",
      password: "user1234",
      full_name: "Normal User",
      role: "user",
    },
  ];

  for (const u of users) {
    const {
      data,
      error,
    }: { data: { user: User | null }; error: AuthError | null } =
      await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name },
      });

    if (!data.user) continue;

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: u.full_name,
      role: u.role,
    });

    if (profileError)
      throw new Error(profileError.message || JSON.stringify(profileError));
    if (error) throw new Error(error.message || JSON.stringify(error));
    else console.log(`✅ Created user ${u.email}`);
  }
}
