import { WorkNodeModel } from '@/ts/base/model';

// 类型 枚举
export enum dataType {
  'STRING' = 'STRING',
  'NUMERIC' = 'NUMERIC',
  'DICT' = 'DICT',
  'DATE' = 'DATE',
  'BELONG' = 'BELONG',
}

export enum AddNodeType {
  'CC' = '抄送',
  'ROOT' = '起始',
  'EMPTY'='空节点',
  'APPROVAL' = '审批',
  'CONDITION' = '条件',
  'CONCURRENTS' = '全部',
  'ORGANIZATIONA' = '组织',
  'CHILDWORK' = '子流程',
}

export type FieldCondition = {
  label: string;
  value: string;
  type: dataType;
  dict?: {
    label: string;
    value: string;
  }[];
};

export type conditiondType = {
  pos: number;
  paramKey: string;
  paramLabel: string;
  key: string;
  label: string;
  type: dataType;
  val: string | undefined;
  valLabel?: string;
  display: string;
  dict?: any[];
};

export type NodeModel = {
  task?: any;
  nodeId: string;
  parentId: string;
  type: AddNodeType;
  conditions: conditiondType[];
}&WorkNodeModel;

export const getConditionKeys: (type: string) => any[] = (type: string) => {
  var keys: any[] = [];
  switch (type) {
    case 'NUMERIC':
      keys = [
        { value: 'EQ', label: '=' },
        { value: 'GT', label: '>' },
        { value: 'GTE', label: '≥' },
        { value: 'LT', label: '<' },
        { value: 'LTE', label: '≤' },
        { value: 'NEQ', label: '≠' },
      ];
      break;
    case 'STRING':
    case 'DICT':
      keys = [
        { value: 'EQ', label: '=' },
        { value: 'NEQ', label: '≠' },
      ];
      break;
  }
  return keys;
};

export const getResource: (resource: any, toInt: boolean) => any = (
  resource: any,
  toInt: boolean,
) => {
  var str = JSON.stringify(resource);
  if (str.indexOf('NUMERIC') <= -1) {
    return resource;
  }
  var res = JSON.parse(JSON.stringify(resource));
  for (let key in res) {
    if (key == 'type' && res['type'] == 'NUMERIC' && res['val']) {
      if (typeof res['val'] == 'string' && toInt) {
        let errorStr = res['val'].replace('"', '').replace('"', '').replace('" ', '');
        res['val'] = parseInt(errorStr);
      }
      if (typeof res['val'] == 'number' && !toInt) {
        res['val'] = res['val'] + '';
      }
    }
    if (key == 'conditions' && res['conditions'] && res['conditions'].length > 0) {
      for (let i = 0; i < res['conditions'].length; i++) {
        res['conditions'][i] = getResource(res['conditions'][i], toInt);
      }
    }
    if (key == 'assignedUser' && res['assignedUser'] && res['assignedUser'].length > 0) {
      for (let i = 0; i < res['assignedUser'].length; i++) {
        res['assignedUser'][i] = getResource(res['assignedUser'][i], toInt);
      }
    }
    if (key == 'branches' && res['branches'] && res['branches'].length > 0) {
      for (let i = 0; i < res['branches'].length; i++) {
        res['branches'][i] = getResource(res['branches'][i], toInt);
      }
    }
    if (key == 'children' && res['children']) {
      res['children'] = getResource(res['children'], toInt);
    }
  }
  return res;
};

//审批节点默认属性
type Approvalprops = {
  [key: string]: any;
};

export const APPROVAL_PROPS: Approvalprops = {
  assignedType: 'USER',
  mode: 'AND',
  num: 1,
  assignedUser: [],
  refuse: {
    type: 'TO_END', //驳回规则 TO_END  TO_NODE  TO_BEFORE
    target: '', //驳回到指定ID的节点
  },
};

//根节点默认属性
export const ROOT_PROPS: Approvalprops = {
  assignedUser: [],
};

//条件节点默认属性
export const CONDITION_PROPS: Approvalprops = {
  groupsType: 'OR', //条件组逻辑关系 OR、AND
  groups: [
    {
      groupType: 'AND', //条件组内条件关系 OR、AND
      cids: [], //条件ID集合
      conditions: [], //组内子条件
    },
  ],
  expression: '', //自定义表达式，灵活构建逻辑关系
};

//条件节点 条件数组
export const CONDITION_CONDITIONS: Approvalprops = {
  pos: 1,
  paramKey: '',
  paramLabel: '',
  key: '',
  label: '',
  type: 'NUMERIC',
  val: null,
  valLabel: '',
};

//抄送节点默认属性
export const CC_PROPS: Approvalprops = {
  assignedUser: [],
};