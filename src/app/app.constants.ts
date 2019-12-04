export class AppConstants {
  // application name
  public static get APPLICATION_NAME(): string { return 'Compounding Management System' }
  
  // token
  public static get TOKEN_HEADER(): string { return 'X-HEB-CAMS-TOKEN'; }

  // urls
  public static get BASE_API_URL(): string { return '/compounding_api' }

  //roles
  public static get SELLER() : string { return 'seller'}
  public static get MEMBER() : string { return 'member'}
  public static get ADMIN() : string { return 'admin'}


  //statuses
  public static get PENDING() : string { return 'PENDING'}
  public static get APPROVED() : string { return 'APPROVED'}
  public static get REJECTED() : string { return 'REJECTED'}

  // icons
  public static get LOG_OFF_ICON(): string { return 'sign-out'; }
  public static get ADD_ICON(): string { return 'plus'; }
  public static get SAVE_ICON(): string { return 'floppy-o'; }
  public static get EDIT_ICON(): string { return 'pencil'; }
  public static get FILTER_ICON(): string { return 'filter'; }
  public static get SEARCH_ICON(): string { return 'search'; }
  public static get CLEAR_ICON(): string { return 'refresh'; }
  public static get EXTERNAL_LINK(): string { return 'external-link'; }
  public static get REMOVE_ICON(): string { return 'minus-square'; }

  // buttons
  public static get BUTTON(): string { return 'btn'; }
  public static get HEB_BUTTON(): string { return 'btn-heb'; }
  public static get MEDIUM_BUTTON(): string { return 'md'; }
  public static get HEB_OUTLINE_BUTTON(): string { return 'btn-outline-heb'; }
  public static get DANGER_BUTTON(): string { return 'btn-danger'; }
  public static get SUCCESS_BUTTON(): string { return 'btn-success'; }
  public static get WARNING_BUTTON(): string { return 'btn-warning'; }
  public static get SEARCH_BUTTON(): string { return 'searchBtn'; }
  public static get CLEAR_BUTTON(): string { return 'clearBtn'; }


  // variables
  public static get SESSION_TIMEOUT_THRESHOLD(): number { return 300; }
  public static get UNITS(): any { return [ 'g', 'ml', 'tablets', 'capsules', 'troches', 'suppositories', 'lollipops', 'treats', 'other' ]}
  public static get STRENGTH_TO_DISPLAY_IN_LABEL(): any { return [ 'mg', 'ratio', '%']}
  public static get STRENGTH_PERCENT(): string { return '%'; }
  public static get STRENGTH_MG(): string { return 'mg'; }
  public static get STRENGTH_RATIO(): string { return ':'; }
  public static get YES() : string { return 'Yes';}
  public static get NO() : string { return 'No';}

  public static get CHAMBER_CAPACITY() : number { return 10; }

}