interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  {
    name: 'Home',
    url: '/dashboard',
    icon: 'fa fa-home fa-5x',
    badge: {
      variant: 'info',
      text: ''
    }
  },
  {
    name: 'Admin Dashboard',
    url: '/admin-dashboard',
    icon: 'fa fa-money fa-5x',
    badge: {
      variant: 'info',
      text: ''
    }
  },
  {
    name: 'Purse',
    url: '/purse',
    icon: 'fa fa-money fa-5x',
    badge: {
      variant: 'info',
      text: ''
    }
  },
  {
    name: 'Sellers',
    url: '/sellers',
    icon: 'fa fa-shopping-basket fa-5x',
    badge: {
      variant: 'info',
      text: ''
    }
  },
  {
    name: 'Vouchers',
    url: '/vouchers',
    icon: 'fa fa-clipboard fa-5x',
    badge: {
      variant: 'info',
      text: ''
    }
  },
  {
    name: 'Account Settings',
    url: '/account-settings',
    icon: 'fa fa-user-o fa-5x',
    badge: {
      variant: 'info',
      text: ''
    }
  },
  {
    name: 'New Page',
    url: '/new-page',
    icon: 'fa fa-sticky-note fa-5x',
    badge: {
      variant: 'info',
      text: ''
    }
  },  // {
  //   name: 'FAQ',
  //   url: '/faq',
  //   icon: 'fa fa-question-circle fa-5x',
  //   badge: {
  //     variant: 'info',
  //     text: ''
  //   }
  // },
  {
    name: 'Terms and Conditions',
    url: '/terms-and-conditions',
    icon: 'fa fa-file fa-5x',
    badge: {
      variant: 'info',
      text: ''
    }
  },
  {
    name: 'Quit',
    url: '/quit',
    icon: 'fa fa-ban fa-5x',
    badge: {
      variant : 'info',
      text: ''
    }
  },


];
