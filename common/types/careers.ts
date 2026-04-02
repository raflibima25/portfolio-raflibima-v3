export interface RoleProps {
  position: string;
  type: string;
  location_type: "Onsite" | "Remote" | "Hybrid";
  start_date: string;
  end_date: string | null;
  responsibilities?: string[];
  tech_stack?: string[];
  projects?: string[];
}

export interface CareerProps {
  company: string;
  logo: string | null;
  location: string;
  industry: string;
  link: string | null;
  roles: RoleProps[];
  isShow?: boolean;
  // legacy single-role fields (kept for backward compat)
  position?: string;
  type?: string;
  location_type?: "Onsite" | "Remote" | "Hybrid";
  start_date?: string;
  end_date?: string | null;
  responsibilities?: string[];
  lessons_learned?: string[];
  impact?: string[];
  indexCareer?: number;
}
