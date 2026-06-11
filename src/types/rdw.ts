export interface RDWVehicleRaw {
  kenteken?: string;
  merk?: string;
  handelsbenaming?: string;
  voertuigsoort?: string;
  inrichting?: string;
  eerste_kleur?: string;
  tweede_kleur?: string;
  aantal_deuren?: string;
  aantal_zitplaatsen?: string;
  brandstof_omschrijving?: string;
  cilinderinhoud?: string;
  nettomaximumvermogen?: string;
  massa_ledig_voertuig?: string;
  massa_rijklaar?: string;
  toegestane_maximum_massa_voertuig?: string;
  catalogusprijs?: string;
  datum_eerste_toelating?: string;
  vervaldatum_apk?: string;
  co2_uitstoot_gecombineerd?: string;
  wam_verzekerd?: string;
  aantal_cilinders?: string;
  vermogen_massarijklaar?: string;
}

export interface RDWApkRaw {
  kenteken?: string;
  vervaldatum_apk?: string;
  vervaldatum_apk_dt?: string;
}

export interface RDWFuelRaw {
  kenteken?: string;
  brandstof_omschrijving?: string;
  cilinderinhoud?: string;
  nettomaximumvermogen?: string;
  co2_uitstoot_gecombineerd?: string;
}