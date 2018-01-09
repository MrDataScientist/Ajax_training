module.exports = [
  {
    name: 'WaterMask',
    description: 'HySpeed Computing WaterMask',
    token: '5-0441-101',
    archiveDays: 30,
    isActive: true,
    orderApproval: false,
    ProductTasks: [{
      PluginId: 2,
      priority: 1,
      blockers: []
    }, {
      PluginId: 3,
      priority: 2,
      blockers: [1]
    }]
  },
  {
    name: 'TimeScan',
    description: 'TimeScan with MultiPurpose Module',
    token: '5-0110-101',
    archiveDays: 30,
    isActive: true,
    ProductTasks: [{
      PluginId: 1,
      priority: 1,
      blockers: [],
      settings: {
        // email_recipients: 'thomas.esch@dlr.de, oos-manager@cloudeo-ag.com, dbellos@cloudeo-ag.com',
        email_recipients: '{{user.UserMail}}',
        email_subject: 'New order for "TimeScan"',
        email_body: `Dear Provider,
We are pleased to inform you that we received a new order for the product TimeScan.

ORDER INFORMATION
--------------------------------------------------
OrderNr:     {{order.OrderNumber}}
Date:          {{order.OrderDateUTC}}
Time:          {{order.OrderTimeUTC}}
SKU:          {{line_item.SKU}}

User:          {{user.CloudEOCustomerID}}
UserMail:   {{user.UserMail}}

Company:  {{billing.BillOrganisation}}
Name:        {{billing.BillName}}
Address:    {{billing.BillLine1}}
City:           {{billing.BillPostalCode}} {{billing.BillCity}}
Country:     {{billing.BillCountryCode}}

Best regards,
The CloudEO Team
`
      }
    }, {
      PluginId: 2,
      priority: 2,
      blockers: [1]
    }, {
      PluginId: 3,
      priority: 3,
      blockers: [2]
    }]
  },
  {
    name: 'TimeScan on Demand',
    description: 'TimeScan on Demand with MultiPurpose Module',
    token: '5-0110-102',
    archiveDays: 30,
    isActive: true,
    ProductTasks: [{
      PluginId: 1,
      priority: 1,
      blockers: [],
      settings: {
        // email_recipients: 'thomas.esch@dlr.de, oos-manager@cloudeo-ag.com, dbellos@cloudeo-ag.com',
        email_recipients: '{{user.UserMail}}',
        email_subject: 'New order for "TimeScan on Demand"',
        email_body: `Dear Provider,
We are pleased to inform you that we received a new order for the product "TimeScan on Demand".

ORDER INFORMATION
--------------------------------------------------
OrderNr:     {{order.OrderNumber}}
Date:          {{order.OrderDateUTC}}
Time:          {{order.OrderTimeUTC}}
SKU:          {{line_item.SKU}}

User:          {{user.CloudEOCustomerID}}
UserMail:   {{user.UserMail}}

Company:  {{billing.BillOrganisation}}
Name:        {{billing.BillName}}
Address:    {{billing.BillLine1}}
City:           {{billing.BillPostalCode}} {{billing.BillCity}}
Country:     {{billing.BillCountryCode}}

Best regards,
The CloudEO Team`
      }
    }, {
      PluginId: 2,
      priority: 2,
      blockers: [1]
    }, {
      PluginId: 3,
      priority: 3,
      blockers: [2]
    }]
  },
  {
    name: 'Urban Heat Islands',
    description: 'Urban Heat Islands with MultiPurpose Module',
    token: '5-0131-110',
    archiveDays: 30,
    isActive: true,
    orderApproval: false,
    ProductTasks: [{
      PluginId: 2,
      priority: 1,
      blockers: []
    }, {
      PluginId: 3,
      priority: 2,
      blockers: [1]
    }]
  },
  {
    name: 'Silvisense',
    description: 'Silvisense with MultiPurpose Module',
    token: '5-0594-101',
    archiveDays: 30,
    isActive: true,
    orderApproval: false,
    ProductTasks: [{
      PluginId: 2,
      priority: 1,
      blockers: []
    }, {
      PluginId: 3,
      priority: 2,
      blockers: [1]
    }]
  },
  {
    name: 'LandMask',
    description: 'HySpeed Computing LandMask',
    token: '5-0441-102',
    archiveDays: 30,
    isActive: true,
    orderApproval: false,
    ProductTasks: [{
      PluginId: 2,
      priority: 1,
      blockers: []
    }, {
      PluginId: 3,
      priority: 2,
      blockers: [1]
    }]
  },
  {
    name: 'Show my Site Access',
    description: 'Show my Site Access Product',
    token: '5-0101-109',
    archiveDays: 0,
    isActive: true,
    orderApproval: true,
    orderDoneDescription: 'Please log in to the ShowMySite application using your Store username and password: https://showmysite.cloudeo.store',
    ProductTasks: [{
      PluginId: 1,
      priority: 1,
      blockers: [],
      settings: {
        // email_recipients: '{{user.UserMail}}, oos-manager@cloudeo-ag.com, sales@cloudeo-ag.com',
        email_recipients: '{{user.UserMail}}',
        email_subject: 'Show my Site - Application access',
        email_body: `Dear Client,

your order {{order.OrderNumber}} has been processed.

How to access CloudEO ShowMySite:

Please open https://showmysite.cloudeo.store  in your internet browser and click on "Login".
Select the store where you ordered and login using your Store username and password. You can use ShowMySite between {{line_item.StartDate}} and {{line_item.EndDate}}.
For more information you can download the manual here: https://showmysite.cloudeo.store/static/user-guide.pdf. It is also anytime available in the ShowMySite application.

In case of any questions, please do not hesitate to contact us at service@cloudeo-ag.com.

Best regards
Your CloudEO Service Team`
      }
    }]
  },
  {
    name: 'Show my Site - Free Trial',
    description: 'Show my Site - Free Trial',
    token: '5-0101-115',
    archiveDays: 0,
    isActive: true,
    orderApproval: true,
    orderDoneDescription: 'Please log in to the ShowMySite application using your Store username and password: https://showmysite.cloudeo.store',
    ProductTasks: [{
      PluginId: 1,
      priority: 1,
      blockers: [],
      settings: {
        process_state_description: 'Please log in to the ShowMySite application using your Store username and password: https://showmysite.cloudeo.store',
        // email_recipients: '{{user.UserMail}}, oos-manager@cloudeo-ag.com',
        email_recipients: '{{user.UserMail}}',
        email_subject: 'Show my Site - Trial access',
        email_body: `Dear Client,

your order {{order.OrderNumber}} has been processed.

How to access CloudEO ShowMySite:

1. Please open https://showmysite.cloudeo.store  in your internet browser
2. Login using your Store username and password
3. The credentials for your free trial will be valid for 1 week

For more information you can download the manual here: https://showmysite.cloudeo.store/static/user-guide.pdf. It is also anytime available in the ShowMySite application.

In case of any questions, please do not hesitate to contact us at service@cloudeo-ag.com.

Best regards
Your CloudEO Service Team`
      }
    }]
  },
  {
    name: 'L8Genesis',
    description: 'Exogenesis L8Genesis',
    token: '5-0411-102',
    archiveDays: 30,
    isActive: true,
    ProductTasks: [{
      PluginId: 1,
      priority: 1,
      blockers: [],
      settings: {
        // email_recipients: '{{user.UserMail}}, service@cloudeo-ag.com',
        email_recipients: '{{user.UserMail}}',
        email_subject: 'Order {{order.OrderNumber}} on CloudEO Store',
        email_body: `Dear {{billing.BillName}},

We are happy to confirm your order and are now processing your product: L8GENESIS. This may take some time dependent on the selected options.
Please visit your user profile on www.cloudeo.store and open the tab "Current Services" to find the processing status of your order. Once your product is ready you will receive an e-mail notification.
If you have any questions, please do not hesitate to contact us at service@cloudeo-ag.com
Kind regards,
CloudEO Service Team`
      }
    }, {
      PluginId: 2,
      priority: 2,
      blockers: [1]
    }, {
      PluginId: 3,
      priority: 3,
      blockers: [2]
    }, {
      PluginId: 1,
      priority: 4,
      blockers: [3],
      settings: {
        // email_recipients: '{{user.UserMail}}, service@cloudeo-ag.com',
        email_recipients: '{{user.UserMail}}',
        email_subject: 'Order {{order.OrderNumber}} on CloudEO Store',
        email_body: `Dear {{billing.BillName}},

your product: L8GENESIS has been processed. Please visit your user profile on www.cloudeo.store and open the tab "Current Services" to access the results.

If you encounter any problems or if you have any questions, please do not hesitate to contact us at service@cloudeo-ag.com
Kind regards,
CloudEO Service Team`
      }
    }]
  },
  {
    name: 'Landsat-8 Workbench',
    description: 'CloudEO Landsat-8 Workbench',
    token: '5-0101-113',
    archiveDays: 30,
    isActive: true,
    ProductTasks: [{
      PluginId: 2,
      priority: 1,
      blockers: []
    }]
  }
]
