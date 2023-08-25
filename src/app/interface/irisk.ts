export interface Irisk {
  active           :  number;
  closing_incharge :  string; // the name of the person who has closed the risk
  description      :  string; // description of the risk
  id_concept       :  number; // concept identifier from the concept catalog
  id_project       :  string; // project
  imp_cost         :  number; // cost of the impact
  imp_quality      :  number; // quality of the impact
  imp_scope        :  number; // scope of the impact
  imp_score        :  number; // score of the impact (probability*imp_score)+(probability*imp_time)+(probability*imp_cost)+(probability*imp_quality)
  imp_time         :  number; // time of the impact
  observations     :  string; // observation of the risk
  owner            :  string; // owner of the risk
  phase            :  string; // phase of the risk
  pos              :  number; // position of the record
  probability      :  number; // probability of the risk
  response         :  string; // response to the risk
  rimp_cost        :  number; // impact cost review
  rimp_quality     :  number; // impact quality review
  rimp_scope       :  number; // impact scope review
  rimp_score       :  number; // impact score review (probability*imp_score)+(probability*imp_time)+(probability*imp_cost)+(probability*imp_quality)
  rimp_time        :  number; // impact time review
  rprobability     :  number; // risk probability review
  status           :  string; // status of the risk
}

export interface Irinteres{
  id_risk : string;
  name    : string;
  email   : string;
}

export interface Iactions{
  id_risk         : string;
  pos             : number; //
  adescription    : string; // description of the action
  startDate       : string; // start date of the action
  endDate         : string; // end date of the action
  monitoring_date : string; // date of the risk monitoring
  lastTrackingDate: string; // date of the last tracking
  total_cost      : number; // total cost of the action (sum of resource costs)
  sum_progress    : number; // sum of progress (progress+sum_progress)
}

export interface Iresources{
  id_action    : string;
  rdescription : string; // description of the resource
  unit         : string; // unit of the resource
  quantity     : number; // quantity of the resource
  cost         : number; // cost of the resource

}

export interface Itrackingrisk{
  id_action     : string;
  reg_date      : string; // date of record
  progress      : number; // actual progress of the action
  observations  : string; // Action follow-up observations
}
