import { Catalog } from "../react-planner";

let catalog = new Catalog();

import * as Beverage24 from "./cabinets/beverage_24_depth/index.js";
import * as Beverage36 from "./cabinets/beverage_36_depth/index.js";
import * as Beverage30 from "./cabinets/beverage_30_depth/index.js";
import * as Dispensrite from "./cabinets/dispensrite/index.js";
import * as FoodService30 from "./cabinets/food_service_30_depth/index.js";
import * as FoodService36 from "./cabinets/food_service_36_depth/index.js";
import * as Prep24 from "./cabinets/prep_24_depth/index.js";
import * as Prep30 from "./cabinets/prep_30_depth/index.js";
import * as Prep36 from "./cabinets/prep_36_depth/index.js";
import * as Sales24 from "./cabinets/sales_24_depth/index.js";
import * as Sales30 from "./cabinets/sales_30_depth/index.js";
import * as Tower14 from "./cabinets/tower_14_depth/index.js";

for (let x in Beverage24) catalog.registerElement(Beverage24[x]);
for (let x in Beverage36) catalog.registerElement(Beverage36[x]);
for (let x in Beverage30) catalog.registerElement(Beverage30[x]);
for (let x in Dispensrite) catalog.registerElement(Dispensrite[x]);
for (let x in FoodService30) catalog.registerElement(FoodService30[x]);
for (let x in FoodService36) catalog.registerElement(FoodService36[x]);
for (let x in Prep24) catalog.registerElement(Prep24[x]);
for (let x in Prep30) catalog.registerElement(Prep30[x]);
for (let x in Prep36) catalog.registerElement(Prep36[x]);
for (let x in Sales24) catalog.registerElement(Sales24[x]);
for (let x in Sales30) catalog.registerElement(Sales30[x]);
for (let x in Tower14) catalog.registerElement(Tower14[x]);

// Beverage - (name, label, type = 'child', description = '', childs = []) {
const Beverage_24_depth = { name: 'Beverage_24_depth', label: '24" depth' };
const Beverage_30_depth = { name: 'Beverage_30_depth', label: '30" depth' };
const Beverage_36_depth = { name: 'Beverage_36_depth', label: '36" depth' };
catalog.registerCategory('Beverage', 'Beverage', 'parent', '3/4“ thick laminated plywood cabinets with unfinished backs', '', [Beverage_24_depth, Beverage_30_depth, Beverage_36_depth]);

const beverage24 = catalog.registerCategory('Beverage_24_depth', '24\" depth', 'child', '3/4“ thick laminated plywood cabinets with unfinished backs', 'Beverage', [
  Beverage24.blbs_1824,
  Beverage24.blbp_3624,
  Beverage24.blbl_1824,
  Beverage24.blbc_3024,
  Beverage24.blbc_3624,
  Beverage24.blbt_1824,
  Beverage24.blbp_2424,
  Beverage24.blbl_3624,
  Beverage24.blbp_3024,
  Beverage24.blbp_1824,
  Beverage24.blbp_1224,
  Beverage24.blbw_2424,
]);
const beverage30 = catalog.registerCategory('Beverage_30_depth', '30\" depth', 'child', '3/4“ thick laminated plywood cabinets with unfinished backs', 'Beverage', [
  Beverage30.blbs_1830,
  Beverage30.blbp_3630,
  Beverage30.blbl_1830,
  Beverage30.blbc_3030,
  Beverage30.blbc_3630,
  Beverage30.blbt_1830,
  Beverage30.blbp_2430,
  Beverage30.blbl_3630,
  Beverage30.blbp_3030,
  Beverage30.blbp_1830,
  Beverage30.blbp_1230,
  Beverage30.blbw_3030,
]);
const beverage36 = catalog.registerCategory('Beverage_36_depth', '36\" depth', 'child', '3/4“ thick laminated plywood cabinets with unfinished backs', 'Beverage', [
  Beverage36.blbs_1836,
  Beverage36.blbp_3636,
  Beverage36.blbl_1836,
  Beverage36.blbc_3036,
  Beverage36.blbc_3636,
  Beverage36.blbt_1836,
  Beverage36.blbp_2436,
  Beverage36.blbl_3636,
  Beverage36.blbp_3036,
  Beverage36.blbp_1836,
  Beverage36.blbp_1236,
  Beverage36.blbw_3636,
]);

// FoodService
const FoodService_30_depth = { name: 'FoodService_30_depth', label: '30" depth' };
const FoodService_36_depth = { name: 'FoodService_36_depth', label: '36" depth' };
catalog.registerCategory('FoodService', 'Food Service', 'parent', '3/4” thick low pressure laminated particleboard cabinets with finished backs and rear toe kicks', '', [FoodService_30_depth, FoodService_36_depth]);

const foodService30 = catalog.registerCategory('FoodService_30_depth', '30\" depth', 'child', '3/4” thick low pressure laminated particleboard cabinets with finished backs and rear toe kicks', 'Food Service', [
  FoodService30.blfl_2430,
  FoodService30.blfl_3030,
  FoodService30.blfl_3630,
  FoodService30.blfo_1230,
  FoodService30.blfo_1830,
  FoodService30.blfo_2430,
  FoodService30.blfo_3030,
  FoodService30.blfo_3630,
  FoodService30.blfs_1830,
  FoodService30.blfw_3030,
]);
const foodService36 = catalog.registerCategory('FoodService_36_depth', '36\" depth', 'child', '3/4” thick low pressure laminated particleboard cabinets with finished backs and rear toe kicks', 'Food Service', [
  FoodService36.blfl_2436,
  FoodService36.blfl_3036,
  FoodService36.blfl_3636,
  FoodService36.blfo_1236,
  FoodService36.blfo_1836,
  FoodService36.blfo_2436,
  FoodService36.blfo_3036,
  FoodService36.blfo_3636,
  FoodService36.blfs_1836,
  FoodService36.blfw_3636,
]);

// Prep
const Prep_24_depth = { name: 'Prep_24_depth', label: '24" depth' };
const Prep_30_depth = { name: 'Prep_30_depth', label: '30" depth' };
const Prep_36_depth = { name: 'Prep_36_depth', label: '36" depth' };
catalog.registerCategory('Prep', 'Prep', 'parent', '3/4” thick low pressure laminated particleboard cabinets with unfinished backs', '', [Prep_24_depth, Prep_30_depth, Prep_36_depth]);

const prep24 = catalog.registerCategory('Prep_24_depth', '24\" depth', 'child', '3/4” thick low pressure laminated particleboard cabinets with unfinished backs', 'Prep', [
  Prep24.blpo_1224,
  Prep24.blpo_1824,
  Prep24.blpo_2424,
  Prep24.blpo_3024,
  Prep24.blpo_3624,
  Prep24.blpp_1224,
  Prep24.blpp_1824,
  Prep24.blpp_2424,
  Prep24.blpp_3024,
  Prep24.blpp_3624,
  Prep24.blps_1824,
  Prep24.blpt_1824,
  Prep24.blpw_2424,
]);
const prep30 = catalog.registerCategory('Prep_30_depth', '30\" depth', 'child', '3/4” thick low pressure laminated particleboard cabinets with unfinished backs', 'Prep', [
  Prep30.blpo_1230,
  Prep30.blpo_1830,
  Prep30.blpo_2430,
  Prep30.blpo_3030,
  Prep30.blpo_3630,
  Prep30.blpp_1230,
  Prep30.blpp_1830,
  Prep30.blpp_2430,
  Prep30.blpp_3030,
  Prep30.blpp_3630,
  Prep30.blps_1830,
  Prep30.blpt_1830,
  Prep30.blpw_3030,
]);
const prep36 = catalog.registerCategory('Prep_36_depth', '36\" depth', 'child', '3/4” thick low pressure laminated particleboard cabinets with unfinished backs', 'Prep', [
  Prep36.blpo_1236,
  Prep36.blpo_1836,
  Prep36.blpo_2436,
  Prep36.blpo_3036,
  Prep36.blpo_3636,
  Prep36.blpp_1236,
  Prep36.blpp_1836,
  Prep36.blpp_2436,
  Prep36.blpp_3036,
  Prep36.blpp_3636,
  Prep36.blps_1836,
  Prep36.blpt_1836,
  Prep36.blpw_3636,
]);


// Sales
const Sales_24_depth = { name: 'Sales_24_depth', label: '24" depth' };
const Sales_30_depth = { name: 'Sales_30_depth', label: '30" depth' };
catalog.registerCategory('Sales', 'Sales', 'parent', '3/4” thick low pressure laminated particleboard cabinets with finished backs and rear toe kicks', '', [Sales_24_depth, Sales_30_depth]);


const sales24 = catalog.registerCategory('Sales_24_depth', '24\" depth', 'child', '3/4” thick low pressure laminated particleboard cabinets with finished backs and rear toe kicks', 'Sales', [
  Sales24.blsb_2424,
  Sales24.blsh_2424,
  Sales24.blso_1224,
  Sales24.blso_1824,
  Sales24.blso_2424,
  Sales24.blso_3024,
  Sales24.blso_3624,
  Sales24.blsw_2424,
  Sales24.blsz_2424,
]);
const sales30 = catalog.registerCategory('Sales_30_depth', '30\" depth', 'child', '3/4” thick low pressure laminated particleboard cabinets with finished backs and rear toe kicks', 'Sales', [
  Sales30.blsb_2430,
  Sales30.blsh_2430,
  Sales30.blso_1230,
  Sales30.blso_1830,
  Sales30.blso_2430,
  Sales30.blso_3030,
  Sales30.blso_3630,
  Sales30.blsw_3030,
  Sales30.blsz_2430,
]);


catalog.registerCategory('Tower_14_depth', 'Tower', 'no-sub', '3/4” thick low pressure laminated particleboard sales towers with finished backs', '', [
  Tower14.blth0_2614,
  Tower14.blth_2614,
]);

catalog.registerCategory('Countertop_Dispenser', 'Countertop Dispenser', 'no-sub', 'Plastic countertop dispensers with cup, lid, and straw dispensers', '', [
  Dispensrite.stl_c_3lbt,
  Dispensrite.stl_c_3rbt,
  Dispensrite.stl_c_4lbt,
  Dispensrite.stl_c_4rbt,
  Dispensrite.stl_s_3bt,
  Dispensrite.stl_s_4bt,
]);

export default catalog;