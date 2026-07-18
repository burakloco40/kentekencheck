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
  datum_tenaamstelling?: string;
  datum_eerste_tenaamstelling_in_nederland?: string;
  vervaldatum_apk?: string;
  co2_uitstoot_gecombineerd?: string;
  wam_verzekerd?: string;
  aantal_cilinders?: string;
  vermogen_massarijklaar?: string;
  openstaande_terugroepactie_indicator?: string;
  export_indicator?: string;
  tellerstandoordeel?: string;
  jaar_laatste_registratie_tellerstand?: string;
  type?: string;
  variant?: string;
  uitvoering?: string;
  typegoedkeuringsnummer?: string;
  wielbasis?: string;
  bruto_bpm?: string;
  zuinigheidsclassificatie?: string;
  maximum_massa_trekken_ongeremd?: string;
  maximum_trekken_massa_geremd?: string;
  europese_voertuigcategorie?: string;
  taxi_indicator?: string;
}

export interface RDWApkRaw {
  kenteken?: string;
  vervaldatum_apk?: string;
  vervaldatum_apk_dt?: string;
  brandstof_omschrijving?: string;
  nettomaximumvermogen?: string;
  co2_uitstoot_gecombineerd?: string;
  cilinderinhoud?: string;
}

export interface RDWFuelRaw {
  kenteken?: string;
  brandstof_volgnummer?: string;
  brandstof_omschrijving?: string;
  cilinderinhoud?: string;
  nettomaximumvermogen?: string;
  nominaal_continu_maximumvermogen?: string;
  netto_max_vermogen_elektrisch?: string;
  co2_uitstoot_gecombineerd?: string;
  brandstofverbruik_gecombineerd?: string;
  brandstofverbruik_stad?: string;
  brandstofverbruik_buiten_de_bebouwde_kom?: string;
  uitlaatemissieniveau?: string;
  emissiecode_omschrijving?: string;
  geluidsniveau_rijdend?: string;
  klasse_hybride_elektrisch_voertuig?: string;
}

export interface RDWKeuringRaw {
  kenteken?: string;
  meld_datum_door_keuringsinstantie?: string;
  meld_tijd_door_keuringsinstantie?: string;
  soort_melding_ki_omschrijving?: string;
  vervaldatum_keuring?: string;
  vervaldatum_keuring_dt?: string;
}

export interface RDWGebrekRaw {
  kenteken?: string;
  meld_datum_door_keuringsinstantie?: string;
  meld_tijd_door_keuringsinstantie?: string;
  gebrek_identificatie?: string;
  aantal_gebreken_geconstateerd?: string;
}

export interface RDWGebrekOmschrijvingRaw {
  gebrek_identificatie?: string;
  gebrek_omschrijving?: string;
}

export interface RDWTerugroepRaw {
  kenteken?: string;
  referentiecode_rdw?: string;
  code_status?: string;
  status?: string;
}