events表结构：
[
  {
    "description": "事件ID（主键）",
    "field_id": "fldd33RNIk",
    "field_name": "event_id",
    "is_primary": true,
    "property": {
      "auto_serial": {
        "options": [
          {
            "type": "fixed_text",
            "value": "ET"
          },
          {
            "type": "system_number",
            "value": "9"
          }
        ],
        "type": "custom"
      }
    },
    "type": 1005,
    "ui_type": "AutoNumber"
  },
  {
    "field_id": "fldkaDfZsw",
    "field_name": "title",
    "is_primary": false,
    "property": null,
    "type": 1,
    "ui_type": "Text"
  },
  {
    "field_id": "fldlMAy2sv",
    "field_name": "status",
    "is_primary": false,
    "property": {
      "options": [
        {
          "color": 0,
          "id": "optKQgNnTm",
          "name": "进行中"
        },
        {
          "color": 1,
          "id": "optov3wPlW",
          "name": "已结束"
        }
      ]
    },
    "type": 3,
    "ui_type": "SingleSelect"
  },
  {
    "field_id": "fldjvDTrxM",
    "field_name": "start_date",
    "is_primary": false,
    "property": {
      "auto_fill": false,
      "date_formatter": "yyyy/MM/dd"
    },
    "type": 5,
    "ui_type": "DateTime"
  },
  {
    "field_id": "fldkp2BJsn",
    "field_name": "end_date",
    "is_primary": false,
    "property": {
      "auto_fill": false,
      "date_formatter": "yyyy/MM/dd"
    },
    "type": 5,
    "ui_type": "DateTime"
  },
  {
    "field_id": "fld54mnPbT",
    "field_name": "description",
    "is_primary": false,
    "property": null,
    "type": 1,
    "ui_type": "Text"
  },
  {
    "field_id": "fldydmw0OH",
    "field_name": "comment_count",
    "is_primary": false,
    "property": {
      "filter_info": {
        "conditions": {
          "children": [
            {
              "field_id": "fld3ayCSqm",
              "field_type": 21,
              "operator": "is",
              "value": null
            }
          ],
          "conjunction": "and"
        },
        "target_table": "tbl36h41v2pW3EMZ"
      },
      "formatter": "0",
      "formula": "bitable::$table[tbl36h41v2pW3EMZ].FILTER(CurrentValue.$column[fld3ayCSqm]=bitable::$table[tblGGeNFxIWyWkj6].$field[fldd33RNIk]).$column[fldkol320H].LISTCOMBINE().COUNTA()",
      "roll_up": 2,
      "target_field": "fldkol320H"
    },
    "type": 19,
    "ui_type": "Lookup"
  },
  {
    "field_id": "fld1oHXGTv",
    "field_name": "tags",
    "is_primary": false,
    "property": {
      "options": [
        {
          "color": 0,
          "id": "opt1118647198",
          "name": "无匹配标签"
        },
        {
          "color": 1,
          "id": "opt1786711168",
          "name": "小区高空抛物事件"
        }
      ]
    },
    "type": 4,
    "ui_type": "MultiSelect"
  },
  {
    "field_id": "fldD8l4XYk",
    "field_name": "created_by",
    "is_primary": false,
    "property": null,
    "type": 1,
    "ui_type": "Text"
  },
  {
    "field_id": "fldaqYhred",
    "field_name": "created_at",
    "is_primary": false,
    "property": {
      "auto_fill": true,
      "date_formatter": "yyyy/MM/dd HH:mm"
    },
    "type": 5,
    "ui_type": "DateTime"
  },
  {
    "field_id": "flddURybfy",
    "field_name": "时间线表（Timeline）",
    "is_primary": false,
    "property": {
      "back_field_id": "fld3ayCSqm",
      "back_field_name": "event_id",
      "multiple": true,
      "table_id": "tbl36h41v2pW3EMZ",
      "table_name": "时间线表（Timeline）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  },
  {
    "field_id": "fldA4qOvxi",
    "field_name": "投票表（Votes）",
    "is_primary": false,
    "property": {
      "back_field_id": "fld1PPh9Wr",
      "back_field_name": "event_id",
      "multiple": true,
      "table_id": "tblxZ5f6lgGk18tL",
      "table_name": "投票表（Votes）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  }
]

timeline表结构：
[
  {
    "field_id": "fldkol320H",
    "field_name": "timeline_id",
    "is_primary": true,
    "property": {
      "auto_serial": {
        "options": [
          {
            "type": "fixed_text",
            "value": "TL"
          },
          {
            "type": "system_number",
            "value": "9"
          }
        ],
        "type": "custom"
      }
    },
    "type": 1005,
    "ui_type": "AutoNumber"
  },
  {
    "field_id": "fld3ayCSqm",
    "field_name": "event_id",
    "is_primary": false,
    "property": {
      "back_field_id": "flddURybfy",
      "back_field_name": "时间线表（Timeline）",
      "multiple": false,
      "table_id": "tblGGeNFxIWyWkj6",
      "table_name": "事件表（Events）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  },
  {
    "field_id": "fldbPAtpcW",
    "field_name": "content",
    "is_primary": false,
    "property": null,
    "type": 1,
    "ui_type": "Text"
  },
  {
    "field_id": "flds1Fu09M",
    "field_name": "openid",
    "is_primary": false,
    "property": {
      "back_field_id": "fldIyFXxBD",
      "back_field_name": "时间线表（Timeline）",
      "multiple": false,
      "table_id": "tblfXC7NC9ZsT69E",
      "table_name": "用户表（users）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  },
  {
    "field_id": "fldbsprH7C",
    "field_name": "nickname",
    "is_primary": false,
    "property": {
      "filter_info": {
        "conditions": {
          "children": [
            {
              "field_id": "fld1uB48xp",
              "field_type": 1005,
              "operator": "is",
              "value": null
            }
          ],
          "conjunction": "and"
        },
        "target_table": "tblfXC7NC9ZsT69E"
      },
      "formatter": "",
      "formula": "bitable::$table[tblfXC7NC9ZsT69E].FILTER(CurrentValue.$column[fld1uB48xp]=bitable::$table[tbl36h41v2pW3EMZ].$field[flds1Fu09M]).$column[fldsOifSrO].LISTCOMBINE()",
      "roll_up": 0,
      "target_field": "fldsOifSrO"
    },
    "type": 19,
    "ui_type": "Lookup"
  },
  {
    "field_id": "fldLWc9B3I",
    "field_name": "publish_time",
    "is_primary": false,
    "property": {
      "auto_fill": true,
      "date_formatter": "yyyy/MM/dd HH:mm"
    },
    "type": 5,
    "ui_type": "DateTime"
  },
  {
    "field_id": "flddGRV34s",
    "field_name": "images",
    "is_primary": false,
    "property": null,
    "type": 17,
    "ui_type": "Attachment"
  },
  {
    "field_id": "fldSqsur3w",
    "field_name": "like_count",
    "is_primary": false,
    "property": {
      "formatter": "0"
    },
    "type": 2,
    "ui_type": "Number"
  },
  {
    "field_id": "fldsr566KM",
    "field_name": "comment_count",
    "is_primary": false,
    "property": {
      "filter_info": {
        "conditions": {
          "children": [
            {
              "field_id": "fldVt1BxMq",
              "field_type": 21,
              "operator": "is",
              "value": null
            }
          ],
          "conjunction": "and"
        },
        "target_table": "tblKD957TsPgrNJn"
      },
      "formatter": "0",
      "formula": "bitable::$table[tblKD957TsPgrNJn].FILTER(CurrentValue.$column[fldVt1BxMq]=bitable::$table[tbl36h41v2pW3EMZ].$field[fldkol320H]).$column[fldde485YV].LISTCOMBINE().COUNTA()",
      "roll_up": 2,
      "target_field": "fldde485YV"
    },
    "type": 19,
    "ui_type": "Lookup"
  },
  {
    "field_id": "fldchcrU2Y",
    "field_name": "type",
    "is_primary": false,
    "property": {
      "options": [
        {
          "color": 1,
          "id": "optJhialSX",
          "name": "投票"
        },
        {
          "color": 2,
          "id": "optOJwRJL5",
          "name": "公告"
        },
        {
          "color": 3,
          "id": "optXV4Gxzp",
          "name": "倡议"
        }
      ]
    },
    "type": 3,
    "ui_type": "SingleSelect"
  },
  {
    "field_id": "fldRT1h3YQ",
    "field_name": "评论表（Comments）",
    "is_primary": false,
    "property": {
      "back_field_id": "fldVt1BxMq",
      "back_field_name": "timeline_id",
      "multiple": false,
      "table_id": "tblKD957TsPgrNJn",
      "table_name": "评论表（Comments）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  }
]

comments表结构：
[
  {
    "field_id": "fldde485YV",
    "field_name": "comment_id",
    "is_primary": true,
    "property": {
      "auto_serial": {
        "options": [
          {
            "type": "fixed_text",
            "value": "CT"
          },
          {
            "type": "system_number",
            "value": "9"
          }
        ],
        "type": "custom"
      }
    },
    "type": 1005,
    "ui_type": "AutoNumber"
  },
  {
    "field_id": "fldVt1BxMq",
    "field_name": "timeline_id",
    "is_primary": false,
    "property": {
      "back_field_id": "fldRT1h3YQ",
      "back_field_name": "评论表（Comments）",
      "multiple": false,
      "table_id": "tbl36h41v2pW3EMZ",
      "table_name": "时间线表（Timeline）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  },
  {
    "field_id": "fldeQgKshg",
    "field_name": "event_id",
    "is_primary": false,
    "property": {
      "filter_info": {
        "conditions": {
          "children": [
            {
              "field_id": "fldkol320H",
              "field_type": 1005,
              "operator": "is",
              "value": null
            }
          ],
          "conjunction": "and"
        },
        "target_table": "tbl36h41v2pW3EMZ"
      },
      "formatter": "",
      "formula": "bitable::$table[tbl36h41v2pW3EMZ].FILTER(CurrentValue.$column[fldkol320H]=bitable::$table[tblKD957TsPgrNJn].$field[fldVt1BxMq]).$column[fld3ayCSqm].LISTCOMBINE()",
      "roll_up": 0,
      "target_field": "fld3ayCSqm"
    },
    "type": 19,
    "ui_type": "Lookup"
  },
  {
    "field_id": "fldAynL1MR",
    "field_name": "content",
    "is_primary": false,
    "property": null,
    "type": 1,
    "ui_type": "Text"
  },
  {
    "field_id": "flda7na1gZ",
    "field_name": "openid",
    "is_primary": false,
    "property": {
      "back_field_id": "fldA4tDERE",
      "back_field_name": "评论表（Comments）",
      "multiple": false,
      "table_id": "tblfXC7NC9ZsT69E",
      "table_name": "用户表（users）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  },
  {
    "field_id": "fldIV4YU6n",
    "field_name": "nickname",
    "is_primary": false,
    "property": {
      "filter_info": {
        "conditions": {
          "children": [
            {
              "field_id": "fld1uB48xp",
              "field_type": 1005,
              "operator": "is",
              "value": null
            }
          ],
          "conjunction": "and"
        },
        "target_table": "tblfXC7NC9ZsT69E"
      },
      "formatter": "",
      "formula": "bitable::$table[tblfXC7NC9ZsT69E].FILTER(CurrentValue.$column[fld1uB48xp]=bitable::$table[tblKD957TsPgrNJn].$field[flda7na1gZ]).$column[fldsOifSrO].LISTCOMBINE()",
      "roll_up": 0,
      "target_field": "fldsOifSrO"
    },
    "type": 19,
    "ui_type": "Lookup"
  },
  {
    "field_id": "fldywEIQ9V",
    "field_name": "publish_time",
    "is_primary": false,
    "property": {
      "auto_fill": true,
      "date_formatter": "yyyy/MM/dd HH:mm"
    },
    "type": 5,
    "ui_type": "DateTime"
  },
  {
    "field_id": "fldl9zO300",
    "field_name": "parent_id",
    "is_primary": false,
    "property": {
      "back_field_id": "fldJF4NJ4s",
      "back_field_name": "评论表（Comments）",
      "multiple": false,
      "table_id": "tblKD957TsPgrNJn",
      "table_name": "评论表（Comments）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  },
  {
    "field_id": "fldHYIhv2L",
    "field_name": "like_count",
    "is_primary": false,
    "property": {
      "formatter": "0"
    },
    "type": 2,
    "ui_type": "Number"
  }
]

votes表结构：
[
  {
    "field_id": "fld2BfRB07",
    "field_name": "vote_id",
    "is_primary": true,
    "property": {
      "auto_serial": {
        "options": [
          {
            "type": "fixed_text",
            "value": "VT"
          },
          {
            "type": "system_number",
            "value": "9"
          }
        ],
        "type": "custom"
      }
    },
    "type": 1005,
    "ui_type": "AutoNumber"
  },
  {
    "field_id": "fld1PPh9Wr",
    "field_name": "event_id",
    "is_primary": false,
    "property": {
      "back_field_id": "fldA4qOvxi",
      "back_field_name": "投票表（Votes）",
      "multiple": false,
      "table_id": "tblGGeNFxIWyWkj6",
      "table_name": "事件表（Events）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  },
  {
    "field_id": "fldTeVYr3d",
    "field_name": "timeline_id",
    "is_primary": false,
    "property": {
      "filter_info": {
        "conditions": {
          "children": [
            {
              "field_id": "fld3ayCSqm",
              "field_type": 21,
              "operator": "is",
              "value": null
            }
          ],
          "conjunction": "and"
        },
        "target_table": "tbl36h41v2pW3EMZ"
      },
      "formatter": "",
      "formula": "bitable::$table[tbl36h41v2pW3EMZ].FILTER(CurrentValue.$column[fld3ayCSqm]=bitable::$table[tblxZ5f6lgGk18tL].$field[fld1PPh9Wr]).$column[fldkol320H].LISTCOMBINE()",
      "roll_up": 0,
      "target_field": "fldkol320H"
    },
    "type": 19,
    "ui_type": "Lookup"
  },
  {
    "field_id": "fldV9njaWu",
    "field_name": "title",
    "is_primary": false,
    "property": null,
    "type": 1,
    "ui_type": "Text"
  },
  {
    "field_id": "fldqKlPo9v",
    "field_name": "description",
    "is_primary": false,
    "property": null,
    "type": 1,
    "ui_type": "Text"
  },
  {
    "field_id": "fld6cQsGuT",
    "field_name": "start_time",
    "is_primary": false,
    "property": {
      "auto_fill": false,
      "date_formatter": "yyyy/MM/dd"
    },
    "type": 5,
    "ui_type": "DateTime"
  },
  {
    "field_id": "fldaWJcjCU",
    "field_name": "end_time",
    "is_primary": false,
    "property": {
      "auto_fill": false,
      "date_formatter": "yyyy/MM/dd"
    },
    "type": 5,
    "ui_type": "DateTime"
  },
  {
    "field_id": "fldHgl99Qv",
    "field_name": "status",
    "is_primary": false,
    "property": {
      "options": [
        {
          "color": 0,
          "id": "optHUZkQW4",
          "name": "进行中"
        },
        {
          "color": 1,
          "id": "optpUoeIWV",
          "name": "已结束"
        }
      ]
    },
    "type": 3,
    "ui_type": "SingleSelect"
  },
  {
    "field_id": "fldk8yzNzx",
    "field_name": "participant_count",
    "is_primary": false,
    "property": {
      "formatter": "0"
    },
    "type": 2,
    "ui_type": "Number"
  },
  {
    "field_id": "fldNGBD4gZ",
    "field_name": "publish_time",
    "is_primary": false,
    "property": {
      "auto_fill": true,
      "date_formatter": "yyyy/MM/dd"
    },
    "type": 5,
    "ui_type": "DateTime"
  }
]

users表结构：
[
  {
    "field_id": "fld1uB48xp",
    "field_name": "openid",
    "is_primary": true,
    "property": {
      "auto_serial": {
        "options": [
          {
            "type": "fixed_text",
            "value": "users"
          },
          {
            "type": "system_number",
            "value": "9"
          }
        ],
        "type": "custom"
      }
    },
    "type": 1005,
    "ui_type": "AutoNumber"
  },
  {
    "field_id": "fldsOifSrO",
    "field_name": "nickName",
    "is_primary": false,
    "property": null,
    "type": 1,
    "ui_type": "Text"
  },
  {
    "field_id": "fldNA4JJbL",
    "field_name": "avatarURL",
    "is_primary": false,
    "property": null,
    "type": 15,
    "ui_type": "Url"
  },
  {
    "field_id": "fldzF4vZ4o",
    "field_name": "mobile",
    "is_primary": false,
    "property": null,
    "type": 13,
    "ui_type": "Phone"
  },
  {
    "field_id": "flddpjiSXg",
    "field_name": "lastLogin",
    "is_primary": false,
    "property": {
      "auto_fill": false,
      "date_formatter": "yyyy/MM/dd HH:mm"
    },
    "type": 5,
    "ui_type": "DateTime"
  },
  {
    "field_id": "fldIyFXxBD",
    "field_name": "时间线表（Timeline）",
    "is_primary": false,
    "property": {
      "back_field_id": "flds1Fu09M",
      "back_field_name": "openid",
      "multiple": false,
      "table_id": "tbl36h41v2pW3EMZ",
      "table_name": "时间线表（Timeline）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  },
  {
    "field_id": "fldA4tDERE",
    "field_name": "评论表（Comments）",
    "is_primary": false,
    "property": {
      "back_field_id": "flda7na1gZ",
      "back_field_name": "openid",
      "multiple": false,
      "table_id": "tblKD957TsPgrNJn",
      "table_name": "评论表（Comments）"
    },
    "type": 21,
    "ui_type": "DuplexLink"
  }
]