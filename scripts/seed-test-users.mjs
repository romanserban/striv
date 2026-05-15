import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

/* eslint-disable expo/no-dynamic-env-var */

const defaults = {
  coachEmail: "coach@striv.test",
  clientEmail: "client@striv.test",
  password: "StrivTest123!"
};

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");

  try {
    const envFile = readFileSync(envPath, "utf8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split("=");
      if (!key || process.env[key]) {
        continue;
      }

      process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  } catch {
    // Environment variables can also be provided by the shell.
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env before running this script.`);
  }

  return value;
}

async function findUserByEmail(supabase, email) {
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw error;
    }

    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
    if (user) {
      return user;
    }

    if (data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

async function upsertAuthUser(supabase, { email, password, fullName, role }) {
  const existing = await findUserByEmail(supabase, email);

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role
      }
    });

    if (error) {
      throw error;
    }

    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role
    }
  });

  if (error) {
    throw error;
  }

  return data.user;
}

async function upsertProfile(supabase, { userId, fullName, role }) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        role,
        full_name: fullName
      },
      { onConflict: "id" }
    )
    .select("id, role, full_name")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function upsertCoachProfile(supabase, userId) {
  const { data, error } = await supabase
    .from("coach_profiles")
    .upsert(
      {
        user_id: userId,
        bio: "Demo strength coach",
        specialty: "Strength and hypertrophy"
      },
      { onConflict: "user_id" }
    )
    .select("id, user_id, invite_code")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function upsertClientProfile(supabase, { userId, coachId }) {
  const { data, error } = await supabase
    .from("client_profiles")
    .upsert(
      {
        user_id: userId,
        coach_id: coachId,
        goal: "Build strength",
        training_level: "Beginner",
        height_cm: 175,
        starting_weight_kg: 75
      },
      { onConflict: "user_id" }
    )
    .select("id, user_id, coach_id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function main() {
  loadEnvFile();

  const supabaseUrl = requireEnv("EXPO_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const coach = await upsertAuthUser(supabase, {
    email: defaults.coachEmail,
    password: defaults.password,
    fullName: "Demo Coach",
    role: "coach"
  });
  const client = await upsertAuthUser(supabase, {
    email: defaults.clientEmail,
    password: defaults.password,
    fullName: "Demo Client",
    role: "client"
  });

  await upsertProfile(supabase, {
    userId: coach.id,
    fullName: "Demo Coach",
    role: "coach"
  });
  await upsertProfile(supabase, {
    userId: client.id,
    fullName: "Demo Client",
    role: "client"
  });

  const coachProfile = await upsertCoachProfile(supabase, coach.id);
  await upsertClientProfile(supabase, {
    userId: client.id,
    coachId: coachProfile.id
  });

  console.log("Seeded demo users:");
  console.log(`Coach:  ${defaults.coachEmail}`);
  console.log(`Client: ${defaults.clientEmail}`);
  console.log(`Password for both: ${defaults.password}`);
  console.log(`Coach invite code: ${coachProfile.invite_code}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
