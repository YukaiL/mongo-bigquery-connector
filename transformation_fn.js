// transformation_fn.js
// functions for data transformation:
// illegal keys, duplicates, missing fields, REPEATED & NULL conflicts etc.
// ================================

module.exports = {
  stringPack: function(tableID, batch) {
    switch (tableID) {
      case 'commands':
        commandsTrans(batch)
        break
      case 'pipelineExecutions':
        pipelineExecutionTrans(batch)
        break
      case 'workflowExecutions':
        workflowExecutionsTrans(batch)
        break
      case 'stateExecutionInstances':
        stateExecutionInstancesTrans(batch)
        break
      case 'services':
        servicesTrans(batch)
        break
      case 'stateMachines':
        stateMachinesTrans(batch)
        break
      case 'workflows':
        workflowsTrans(batch)
        break
      case 'settingAttributes':
        settingAttributesTrans(batch)
        break
      case 'serviceCommands':
        serviceCommandsTrans(batch)
        break
      case 'infrastructureMapping':
        infrastructureMappingTrans(batch)
        break
      case 'artifactStream':
        artifactStreamTrans(batch)
        break
      case 'environments':
        environmentsTrans(batch)
        break
      case 'notificationGroups':
        notificationGroupsTrans(batch)
        break
      case 'deploymentSummary':
        deploymentSummaryTrans(batch)
        break
      case 'pipelines':
        pipelinesTrans(batch)
        break
      case 'triggers':
        triggersTrans(batch)
        break
      case 'userGroups':
        userGroupsTrans(batch)
        break
      case 'delegateScopes':
        delegateScopesTrans(batch)
        break
      case 'hosts':
        hostsTrans(batch)
        break
      case 'instance':
        instanceTrans(batch)
        break
      case 'audits':
        auditsTrans(batch)
        break
      case 'artifacts':
        artifactsTrans(batch)
        break
      case 'activities':
        activitiesTrans(batch)
        break
      case 'containerTasks':
        containerTasksTrans(batch)
        break
      case 'lambdaSpecifications':
        lambdaSpecificationsTrans(batch)
        break
      case 'notifications':
        notificationsTrans(batch)
        break
      case 'terraformConfig':
        terraformConfigTrans(batch)
        break
    }
  }
}

// collection: pipelines
function pipelinesTrans(batch) {
  batch.stateEtaMap = JSON.stringify(batch.stateEtaMap)
}
// collection: workflowExecutions
function workflowExecutionsTrans(batch) {
  batch.stateMachine = JSON.stringify(batch.stateMachine)
  batch.executionArgs = JSON.stringify(batch.executionArgs)
  batch.pipelineExecution = JSON.stringify(batch.pipelineExecution)
  batch.artifacts = JSON.stringify(batch.artifacts)
  batch.serviceExecutionSummaries = JSON.stringify(
    batch.serviceExecutionSummaries
  )
  batch.cloudProviderIds = JSON.stringify(batch.cloudProviderIds)
  batch.workflowIds = JSON.stringify(batch.workflowIds)
}
// collection:  pipelineExecution
function pipelineExecutionTrans(batch) {
  batch.pipelineStageExecutions = JSON.stringify(batch.pipelineStageExecutions)
  batch.pipeline = JSON.stringify(batch.pipeline)
  if (batch.hasOwnProperty('executionArgs')) {
    batch.executionArgs = JSON.stringify(batch.executionArgs)
  }
  if (batch.hasOwnProperty('cloudProviderIds')) {
    batch.cloudProviderIds = JSON.stringify(batch.cloudProviderIds)
  }
}

// collection: commands
function commandsTrans(batch) {
  if (batch.hasOwnProperty('templateVariables')) {
    batch.templateVariables = JSON.stringify(batch.templateVariables)
  }
  if (batch.hasOwnProperty('commandUnits')) {
    batch.commandUnits = JSON.stringify(batch.commandUnits)
  }
}

// collection: services
function servicesTrans(batch) {
  batch.appContainer = JSON.stringify(batch.appContainer)
  batch.artifactStreamIds = JSON.stringify(batch.artifactStreamIds)
}

// collection: stateMachines
function stateMachinesTrans(batch) {
  batch.childStateMachines = JSON.stringify(batch.childStateMachines)
  batch.orchestrationWorkflow = JSON.stringify(batch.orchestrationWorkflow)
  if (batch.hasOwnProperty('states')) {
    batch.states = JSON.stringify(batch.states)
  }
  if (batch.hasOwnProperty('transitions')) {
    batch.transitions = JSON.stringify(batch.transitions)
  }
}

// collection: workflows
function workflowsTrans(batch) {
  batch.orchestration = JSON.stringify(batch.orchestration)
  batch.linkedTemplateUuids = JSON.stringify(batch.linkedTemplateUuids)
  batch.templateExpressions = JSON.stringify(batch.templateExpressions)
}

// collection: settingAttributes
function settingAttributesTrans(batch) {
  if (batch.hasOwnProperty('usageRestrictions')) {
    batch.usageRestrictions = JSON.stringify(batch.usageRestrictions)
  }
  if (batch.hasOwnProperty('value')) {
    batch.value = JSON.stringify(batch.value)
  }
}

// collection: serviceCommands
function serviceCommandsTrans(batch) {
  batch.envIdVersionMap = JSON.stringify(batch.envIdVersionMap)
}

// collection: infrastructureMapping
function infrastructureMappingTrans(batch) {
  if (batch.hasOwnProperty('securityGroupIds')) {
    batch.securityGroupIds = JSON.stringify(batch.securityGroupIds)
  }
  if (batch.hasOwnProperty('hosts')) {
    batch.hosts = JSON.stringify(batch.hosts)
  }
  if (batch.hasOwnProperty('subnetIds')) {
    batch.subnetIds = JSON.stringify(batch.subnetIds)
  }
  if (batch.hasOwnProperty('stageTargetGroupArns')) {
    batch.stageTargetGroupArns = JSON.stringify(batch.stageTargetGroupArns)
  }
  if (batch.hasOwnProperty('targetGroupArns')) {
    batch.targetGroupArns = JSON.stringify(batch.targetGroupArns)
  }
  if (batch.hasOwnProperty('tempRouteMap')) {
    batch.tempRouteMap = JSON.stringify(batch.tempRouteMap)
  }
  if (batch.hasOwnProperty('routeMaps')) {
    if (batch.routeMaps === null) {
      batch.routeMaps = ['null']
    }
  }
  if (batch.hasOwnProperty('stageClassicLoadBalancers')) {
    batch.stageClassicLoadBalancers = JSON.stringify(
      batch.stageClassicLoadBalancers
    )
  }
  if (batch.hasOwnProperty('classicLoadBalancers')) {
    batch.classicLoadBalancers = JSON.stringify(batch.classicLoadBalancers)
  }
}

// collection: artifactStream
function artifactStreamTrans(batch) {
  if (batch.hasOwnProperty('keywords')) {
    batch.keywords = JSON.stringify(batch.keywords)
  }
  if (batch.hasOwnProperty('filters')) {
    batch.filters = JSON.stringify(batch.filters)
  }
  if (batch.hasOwnProperty('tags')) {
    batch.tags = JSON.stringify(batch.tags)
  }
  if (batch.hasOwnProperty('templateVariables')) {
    batch.templateVariables = JSON.stringify(batch.templateVariables)
  }
  if (batch.hasOwnProperty('scripts')) {
    batch.scripts = JSON.stringify(batch.scripts)
  }
}

// collection: environments
function environmentsTrans(batch) {
  if (batch.hasOwnProperty('helmValueYamlByServiceTemplateId')) {
    batch.helmValueYamlByServiceTemplateId = JSON.stringify(
      batch.helmValueYamlByServiceTemplateId
    )
  }
  if (batch.hasOwnProperty('configMapYamlByServiceTemplateId')) {
    batch.configMapYamlByServiceTemplateId = JSON.stringify(
      batch.configMapYamlByServiceTemplateId
    )
  }
}

// collection: notificationGroups
function notificationGroupsTrans(batch) {
  if (batch.hasOwnProperty('addressesByChannelType')) {
    batch.addressesByChannelType = JSON.stringify(batch.addressesByChannelType)
  }
  if (batch.hasOwnProperty('configMapYamlByServiceTemplateId')) {
    batch.configMapYamlByServiceTemplateId = JSON.stringify(
      batch.configMapYamlByServiceTemplateId
    )
  }
}

// collection: deploymentSummary
function deploymentSummaryTrans(batch) {
  batch.deploymentInfo = JSON.stringify(batch.deploymentInfo)
}

// collection: pipelines
function pipelinesTrans(batch) {
  batch.pipelineStages = JSON.stringify(batch.pipelineStages)
  if (batch.hasOwnProperty('failureStrategies')) {
    batch.failureStrategies = JSON.stringify(batch.failureStrategies)
  }
  if (batch.hasOwnProperty('stateEtaMap')) {
    batch.stateEtaMap = JSON.stringify(batch.stateEtaMap)
  }
}

// collection: triggers
function triggersTrans(batch) {
  batch.artifactSelections = JSON.stringify(batch.artifactSelections)
  batch.condition = JSON.stringify(batch.condition)
  if (batch.hasOwnProperty('failureStrategies')) {
    batch.failureStrategies = JSON.stringify(batch.failureStrategies)
  }
  if (batch.hasOwnProperty('stateEtaMap')) {
    batch.stateEtaMap = JSON.stringify(batch.stateEtaMap)
  }
  if (batch.hasOwnProperty('workflowVariables')) {
    batch.workflowVariables = JSON.stringify(batch.workflowVariables)
  }
}

// collection: userGroups
function userGroupsTrans(batch) {
  if (batch.hasOwnProperty('memberIds')) {
    batch.memberIds = JSON.stringify(batch.memberIds)
  }
  if (batch.hasOwnProperty('appPermissions')) {
    batch.appPermissions = JSON.stringify(batch.appPermissions)
  }
}

// collection: delegateScopes
function delegateScopesTrans(batch) {
  if (batch.hasOwnProperty('serviceInfrastructures')) {
    batch.serviceInfrastructures = JSON.stringify(batch.serviceInfrastructures)
  }
  if (batch.hasOwnProperty('environments')) {
    batch.environments = JSON.stringify(batch.environments)
  }
  if (batch.hasOwnProperty('environmentTypes')) {
    batch.environmentTypes = JSON.stringify(batch.environmentTypes)
  }
  if (batch.hasOwnProperty('taskTypes')) {
    batch.taskTypes = JSON.stringify(batch.taskTypes)
  }
  if (batch.hasOwnProperty('applications')) {
    batch.applications = JSON.stringify(batch.applications)
  }
}

// collection: hosts
function hostsTrans(batch) {
  batch.instance = JSON.stringify(batch.instance)
  if (batch.hasOwnProperty('ec2Instance')) {
    batch.ec2Instance = JSON.stringify(batch.ec2Instance)
  }
  if (batch.hasOwnProperty('properties')) {
    batch.properties = JSON.stringify(batch.properties)
  }
}

// collection: instance
function instanceTrans(batch) {
  if (batch.hasOwnProperty('instanceInfo')) {
    batch.instanceInfo = JSON.stringify(batch.instanceInfo)
  }
  if (batch.hasOwnProperty('podInstanceKey')) {
    batch.podInstanceKey = JSON.stringify(batch.podInstanceKey)
  }
  if (batch.hasOwnProperty('pcfInstanceKey')) {
    batch.pcfInstanceKey = JSON.stringify(batch.pcfInstanceKey)
  }
  if (batch.hasOwnProperty('containerInstanceKey')) {
    batch.containerInstanceKey = JSON.stringify(batch.containerInstanceKey)
  }
  if (batch.hasOwnProperty('hostInstanceKey')) {
    batch.hostInstanceKey = JSON.stringify(batch.hostInstanceKey)
  }
}

// collection: audits
function auditsTrans(batch) {
  if (batch.hasOwnProperty('remoteUser')) {
    batch.remoteUser = JSON.stringify(batch.remoteUser)
  }
  if (batch.hasOwnProperty('entityAuditRecords')) {
    batch.entityAuditRecords = JSON.stringify(batch.entityAuditRecords)
  }
  if (batch.hasOwnProperty('gitAuditDetails')) {
    batch.gitAuditDetails = JSON.stringify(batch.gitAuditDetails)
  }
}

// collection: artifacts
function artifactsTrans(batch) {
  if (batch.hasOwnProperty('metadata')) {
    batch.metadata = JSON.stringify(batch.metadata)
  }
  if (batch.hasOwnProperty('artifactFiles')) {
    batch.artifactFiles = JSON.stringify(batch.artifactFiles)
  }
}

// collection: stateExecutionInstances
function stateExecutionInstancesTrans(batch) {
  if (batch.hasOwnProperty('contextElements')) {
    batch.contextElements = JSON.stringify(batch.contextElements)
  }
  if (batch.hasOwnProperty('contextElement')) {
    batch.contextElement = JSON.stringify(batch.contextElement)
  }
  if (batch.hasOwnProperty('stateExecutionMap')) {
    batch.stateExecutionMap = JSON.stringify(batch.stateExecutionMap)
  }
  if (batch.hasOwnProperty('notifyElements')) {
    batch.notifyElements = JSON.stringify(batch.notifyElements)
  }
  if (batch.hasOwnProperty('interruptHistory')) {
    batch.interruptHistory = JSON.stringify(batch.interruptHistory)
  }
  if (batch.hasOwnProperty('stateExecutionDataHistory')) {
    batch.stateExecutionDataHistory = JSON.stringify(
      batch.stateExecutionDataHistory
    )
  }
  if (batch.hasOwnProperty('stateParams')) {
    batch.stateParams = JSON.stringify(batch.stateParams)
  }
  if (batch.hasOwnProperty('executionEventAdvisors')) {
    batch.executionEventAdvisors = JSON.stringify(batch.executionEventAdvisors)
  }
}

// collection: activities
function activitiesTrans(batch) {
  batch.commandUnits = JSON.stringify(batch.commandUnits)
}

// collection: containerTasks
function containerTasksTrans(batch) {
  if (batch.hasOwnProperty('containerDefinitions')) {
    batch.containerDefinitions = JSON.stringify(batch.containerDefinitions)
  }
}

// collection: lambdaSpecifications
function lambdaSpecificationsTrans(batch) {
  batch.functions = JSON.stringify(batch.functions)
  if (batch.hasOwnProperty('defaults')) {
    batch.defaults = JSON.stringify(batch.defaults)
  }
}

// collection: notifications
function notificationsTrans(batch) {
  if (batch.hasOwnProperty('notificationTemplateVariables')) {
    batch.notificationTemplateVariables = JSON.stringify(
      batch.notificationTemplateVariables
    )
  }
}

// collection: terraformConfig
function terraformConfigTrans(batch) {
  batch.variables = JSON.stringify(batch.variables)
}
