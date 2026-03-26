export interface Scheme {
  id: string;
  name: string;
  image: string;
  benefit: string;
  description: string;
  eligibility: string;
  steps: string[];
  link: string;
}

export const schemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop",
    benefit: "₹6,000 per year",
    description: "Income support to all landholding farmers' families in the country to provide for their financial needs for procuring various inputs.",
    eligibility: "All small and marginal landholding farmer families.",
    steps: [
      "Visit the official PM-KISAN portal",
      "Click on 'New Farmer Registration'",
      "Enter Aadhaar details and select state",
      "Fill the registration form with land details",
      "Submit and wait for verification"
    ],
    link: "https://pmkisan.gov.in/"
  },
  {
    id: "pmfby",
    name: "PMFBY (Crop Insurance)",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop",
    benefit: "Financial support for crop loss",
    description: "Pradhan Mantri Fasal Bima Yojana provides insurance coverage and financial support to the farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases.",
    eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
    steps: [
      "Register on the PMFBY portal or through bank/CSC",
      "Provide land records and crop details",
      "Pay the nominal premium amount",
      "Receive insurance policy certificate",
      "In case of loss, report within 72 hours"
    ],
    link: "https://pmfby.gov.in/"
  },
  {
    id: "kcc",
    name: "Kisan Credit Card",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop",
    benefit: "Loan up to ₹3 Lakh at 4% interest",
    description: "Provides timely credit to farmers for their cultivation and other needs as well as for animal husbandry and fisheries.",
    eligibility: "All farmers, individuals/joint borrowers, tenant farmers, oral lessees, and sharecroppers.",
    steps: [
      "Visit your nearest commercial/cooperative/rural bank",
      "Fill the KCC application form",
      "Submit ID proof and address proof",
      "Provide land ownership documents",
      "Bank verifies and issues KCC card"
    ],
    link: "https://www.india.gov.in/spotlight/kisan-credit-card-scheme"
  },
  {
    id: "shc",
    name: "Soil Health Card",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop",
    benefit: "Free soil testing and advice",
    description: "Helps state governments to issue soil health cards to all farmers in the country. It gives information to farmers on nutrient status of their soil.",
    eligibility: "All farmers across India.",
    steps: [
      "Register on the Soil Health Card portal",
      "Request for soil sample collection",
      "Sample is tested in government laboratories",
      "Receive Soil Health Card with recommendations",
      "Apply fertilizers as per card guidance"
    ],
    link: "https://www.soilhealth.dac.gov.in/"
  },
  {
    id: "pmksy",
    name: "PMKSY (Irrigation)",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=2071&auto=format&fit=crop",
    benefit: "Subsidy for micro-irrigation systems",
    description: "Pradhan Mantri Krishi Sinchayee Yojana focuses on creating sources for assured irrigation and protective irrigation by harnessing rain water.",
    eligibility: "All farmers owning land can apply for subsidies for drip/sprinkler systems.",
    steps: [
      "Contact the local agriculture/irrigation department",
      "Apply through the state PMKSY portal",
      "Technical survey of your land is conducted",
      "Installation of micro-irrigation system",
      "Subsidy amount credited to account after verification"
    ],
    link: "https://pmksy.gov.in/"
  },
  {
    id: "pkvy",
    name: "PKVY (Organic Farming)",
    image: "https://images.unsplash.com/photo-1594918731327-024f2b963e63?q=80&w=2070&auto=format&fit=crop",
    benefit: "₹50,000 per hectare subsidy",
    description: "Paramparagat Krishi Vikas Yojana promotes organic farming in India by providing financial assistance to farmers for cluster formation, capacity building, and input procurement.",
    eligibility: "Farmers willing to transition to organic farming through cluster-based approach.",
    steps: [
      "Form a cluster of minimum 50 farmers",
      "Register the cluster with local agriculture office",
      "Adopt organic farming practices",
      "Receive input subsidy for seeds and bio-fertilizers",
      "Cluster gets organic certification after 3 years"
    ],
    link: "https://dmsouth.delhi.gov.in/scheme/paramparagat-krishi-vikas-yojana-pkvy/"
  }
];
