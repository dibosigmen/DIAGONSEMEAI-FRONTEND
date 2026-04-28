import { createClient } from "@supabase/supabase-js";

const API_ENDPOINT = "https://aehbmzwgsggwtznaxwci.supabase.co";
const API_KEY = "sb_publishable_TZxSFP7iMa4OI4h-7Ewzpg_KsOSsWg9";

export const supabase = createClient(API_ENDPOINT, API_KEY);
 