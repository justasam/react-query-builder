import { TableFlowData } from "types";

const tableFlowData: TableFlowData = {
  Tables: [
    {
      table: "Accounts",
      description: "",
      fields: {
        AccountId: "integer",
        OwnerId: "varchar",
        AccountName: "varchar",
        Industry: "varchar",
        CompanySize: "varchar",
        Location: "varchar",
        Revenue: "decimal",
        GrowthRate: "decimal",
        CompanyAge: "integer",
        OrganizationalStructure: "varchar",
        LogoURL: "varchar",
        Plan: "varchar",
        OwnerUserId: "integer",
        CreatedDate: "date",
      },
      rows: 234, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "Contacts",
      description: "",
      fields: {
        ContactId: "integer",
        AccountId: "integer",
        FirstName: "varchar",
        LastName: "varchar",
        Email: "varchar",
        Role: "varchar",
        CurrentDesignTools: "varchar",
        CollaborationTools: "varchar",
        WebDevelopmentStack: "varchar",
        SubscriptionToDesignResources: "varchar",
      },
      rows: 25, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "Leads",
      description: "",
      fields: {
        LeadId: "integer",
        FirstName: "varchar",
        LastName: "varchar",
        Email: "varchar",
        CompanyName: "varchar",
        Role: "varchar",
        PotentialInterest: "varchar",
        CurrentDesignTools: "varchar",
        CollaborationTools: "varchar",
        WebDevelopmentStack: "varchar",
        SubscriptionToDesignResources: "varchar",
      },
      rows: 21, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "Campaigns",
      description: "",
      fields: {
        CampaignId: "integer",
        CampaignName: "varchar",
        StartDate: "date",
        EndDate: "date",
        Budget: "decimal",
        TargetAudience: "varchar",
      },
      rows: 6, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "CampaignMembers",
      description: "",
      fields: {
        MemberId: "integer",
        CampaignId: "integer",
        MemberType: "varchar",
        CampaignFeedback: "varchar",
        CampaignInteractions: "varchar",
      },
      rows: 82, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "OpportunityContactRole",
      description: "",
      fields: {
        OCRId: "integer",
        OpportunityId: "integer",
        ContactId: "integer",
        Role: "varchar",
      },
      rows: 6, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "Opportunities",
      description: "",
      fields: {
        OpportunityId: "integer",
        Name: "varchar [not null]",
        AccountId: "integer",
        StageName: "varchar",
        CloseDate: "date",
        Amount: "decimal",
        Probability: "decimal",
        LeadSource: "varchar",
        Description: "text",
        CreatedDate: "timestamp",
        LastModifiedDate: "timestamp",
        OwnerId: "integer",
      },
      rows: 85, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "SalesReps",
      description: "",
      fields: {
        RepId: "integer",
        FullName: "varchar",
        Email: "varchar",
        Title: "varchar",
        LastLoginDate: "timestamp",
      },
      rows: 26, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "Users",
      description: "",
      fields: {
        UserId: "integer",
        ContactId: "integer",
        FirstName: "varchar",
        LastName: "varchar",
        Email: "varchar",
        PasswordHash: "varchar",
        SignupDate: "timestamp",
        LastActive: "timestamp",
        WorkspaceId: "integer",
        AccountOwner: "boolean",
        Plan: "varchar",
      },
      rows: 0, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "Workspaces",
      description: "",
      fields: {
        WorkspaceId: "integer",
        AccountId: "integer",
        WorkspaceName: "varchar",
      },
      rows: 1235, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "WorkspaceMembers",
      description: "",
      fields: {
        WorkspaceId: "integer",
        UserId: "integer",
      },
      rows: 3453, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "Files",
      description: "",
      fields: {
        FileId: "integer",
        WorkspaceId: "integer",
        FileName: "varchar",
        CreatorUserId: "integer",
        LastUpdated: "timestamp",
        OwnerUserId: "integer",
      },
      rows: 4534, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "FilePermissions",
      description: "",
      fields: {
        FileId: "integer",
        UserId: "integer",
        PermissionType: "varchar",
      },
      rows: 2357, // You can populate this with actual data row counts
      dataSource: "",
    },
    {
      table: "Invitations",
      description: "",
      fields: {
        InvitationId: "integer",
        FileId: "integer",
        InviteeEmail: "varchar",
        InvitingUserId: "integer",
        InvitedUserId: "integer",
        ExpirationDateTime: "timestamp",
        Status: "varchar",
      },
      rows: 315, // You can populate this with actual data row counts
      dataSource: "",
    },
  ],
  Relationships: [
    {
      From: {
        Table: "Users",
        Field: "UserId",
      },
      To: {
        Table: "Workspaces",
        Field: "WorkspaceId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Users",
        Field: "UserId",
      },
      To: {
        Table: "WorkspaceMembers",
        Field: "UserId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Workspaces",
        Field: "WorkspaceId",
      },
      To: {
        Table: "WorkspaceMembers",
        Field: "WorkspaceId",
      },
      Type: "one-to-many",
    },
    {
      From: {
        Table: "Files",
        Field: "WorkspaceId",
      },
      To: {
        Table: "Workspaces",
        Field: "WorkspaceId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Files",
        Field: "CreatorUserId",
      },
      To: {
        Table: "Users",
        Field: "UserId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Files",
        Field: "OwnerUserId",
      },
      To: {
        Table: "Users",
        Field: "UserId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "FilePermissions",
        Field: "FileId",
      },
      To: {
        Table: "Files",
        Field: "FileId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "FilePermissions",
        Field: "UserId",
      },
      To: {
        Table: "Users",
        Field: "UserId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Invitations",
        Field: "FileId",
      },
      To: {
        Table: "Files",
        Field: "FileId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Invitations",
        Field: "InvitingUserId",
      },
      To: {
        Table: "Users",
        Field: "UserId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Invitations",
        Field: "InvitedUserId",
      },
      To: {
        Table: "Users",
        Field: "UserId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Workspaces",
        Field: "AccountId",
      },
      To: {
        Table: "Accounts",
        Field: "AccountId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Accounts",
        Field: "OwnerUserId",
      },
      To: {
        Table: "Users",
        Field: "UserId",
      },
      Type: "one-to-one",
    },
    {
      From: {
        Table: "CampaignMembers",
        Field: "MemberId",
      },
      To: {
        Table: "Leads",
        Field: "LeadId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Campaigns",
        Field: "CampaignId",
      },
      To: {
        Table: "CampaignMembers",
        Field: "CampaignId",
      },
      Type: "one-to-many",
    },
    {
      From: {
        Table: "Contacts",
        Field: "AccountId",
      },
      To: {
        Table: "Accounts",
        Field: "AccountId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "OpportunityContactRole",
        Field: "OpportunityId",
      },
      To: {
        Table: "Opportunities",
        Field: "OpportunityId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "OpportunityContactRole",
        Field: "ContactId",
      },
      To: {
        Table: "Contacts",
        Field: "ContactId",
      },
      Type: "many-to-one",
    },
    {
      From: {
        Table: "Accounts",
        Field: "OwnerId",
      },
      To: {
        Table: "SalesReps",
        Field: "RepId",
      },
      Type: "many-to-one",
    },
  ],
};

export { tableFlowData };
