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
  var temp = JSON.stringify(batch.stateEtaMap)
  batch.stateEtaMap = temp
}
// collection: workflowExecutions
function workflowExecutionsTrans(batch) {
  var temp = JSON.stringify(batch.stateMachine)
  batch.stateMachine = temp
  var temp2 = JSON.stringify(batch.executionArgs)
  batch.executionArgs = temp2
  var temp3 = JSON.stringify(batch.pipelineExecution)
  batch.pipelineExecution = temp3
  var temp4 = JSON.stringify(batch.artifacts)
  batch.artifacts = temp4
  var temp5 = JSON.stringify(batch.serviceExecutionSummaries)
  batch.serviceExecutionSummaries = temp5
  var temp6 = JSON.stringify(batch.cloudProviderIds)
  batch.cloudProviderIds = temp6
  var temp7 = JSON.stringify(batch.workflowIds)
  batch.workflowIds = temp7
}
// collection:  pipelineExecution
function pipelineExecutionTrans(batch) {
  var temp = JSON.stringify(batch.pipelineStageExecutions)
  batch.pipelineStageExecutions = temp
  var temp1 = JSON.stringify(batch.pipeline)
  batch.pipeline = temp1
  if (batch.hasOwnProperty('executionArgs')) {
    var temp2 = JSON.stringify(batch.executionArgs)
    batch.executionArgs = temp2
  }
  if (batch.hasOwnProperty('cloudProviderIds')) {
    var temp3 = JSON.stringify(batch.cloudProviderIds)
    batch.cloudProviderIds = temp3
  }
}

// collection: commands
function commandsTrans(batch) {
  if (batch.hasOwnProperty('templateVariables')) {
    var temp = JSON.stringify(batch.templateVariables)
    batch.templateVariables = temp
  }
  if (batch.hasOwnProperty('commandUnits')) {
    var temp = JSON.stringify(batch.commandUnits)
    batch.commandUnits = temp
  }
}

// collection: services
function servicesTrans(batch) {
  var temp = JSON.stringify(batch.appContainer)
  batch.appContainer = temp
  var temp2 = JSON.stringify(batch.artifactStreamIds)
  batch.artifactStreamIds = temp2
}

// collection: stateMachines
function stateMachinesTrans(batch) {
  var childStateM = JSON.stringify(batch.childStateMachines)
  var orchestration = JSON.stringify(batch.orchestrationWorkflow)
  batch.childStateMachines = childStateM
  batch.orchestrationWorkflow = orchestration
  if (batch.hasOwnProperty('states')) {
    var temp1 = JSON.stringify(batch.states)
    batch.states = temp1
  }
  if (batch.hasOwnProperty('transitions')) {
    var temp2 = JSON.stringify(batch.transitions)
    batch.transitions = temp2
  }
}

// collection: workflows
function workflowsTrans(batch) {
  var temp1 = JSON.stringify(batch.orchestration)
  batch.orchestration = temp1
  var temp2 = JSON.stringify(batch.linkedTemplateUuids)
  batch.linkedTemplateUuids = temp2
  var temp3 = JSON.stringify(batch.templateExpressions)
  batch.templateExpressions = temp3
}

// collection: settingAttributes
function settingAttributesTrans(batch) {
  if (batch.hasOwnProperty('usageRestrictions')) {
    var temp1 = JSON.stringify(batch.usageRestrictions)
    batch.usageRestrictions = temp1
  }

  if (batch.hasOwnProperty('value')) {
    var temp2 = JSON.stringify(batch.value)
    batch.value = temp2
  }
}

// collection: serviceCommands
function serviceCommandsTrans(batch) {
  var temp1 = JSON.stringify(batch.envIdVersionMap)
  batch.envIdVersionMap = temp1
}

// collection: infrastructureMapping
function infrastructureMappingTrans(batch) {
  if (batch.hasOwnProperty('securityGroupIds')) {
    var temp1 = JSON.stringify(batch.securityGroupIds)
    batch.securityGroupIds = temp1
  }
  if (batch.hasOwnProperty('hosts')) {
    var temp2 = JSON.stringify(batch.hosts)
    batch.hosts = temp2
  }
  if (batch.hasOwnProperty('subnetIds')) {
    var temp3 = JSON.stringify(batch.subnetIds)
    batch.subnetIds = temp3
  }
  if (batch.hasOwnProperty('stageTargetGroupArns')) {
    var temp4 = JSON.stringify(batch.stageTargetGroupArns)
    batch.stageTargetGroupArns = temp4
  }
  if (batch.hasOwnProperty('targetGroupArns')) {
    var temp5 = JSON.stringify(batch.targetGroupArns)
    batch.targetGroupArns = temp5
  }
  if (batch.hasOwnProperty('tempRouteMap')) {
    var temp6 = JSON.stringify(batch.tempRouteMap)
    batch.tempRouteMap = temp6
  }
  if (batch.hasOwnProperty('routeMaps')) {
    if (batch.routeMaps === null) {
      batch.routeMaps = ['null']
    }
  }
  if (batch.hasOwnProperty('stageClassicLoadBalancers')) {
    var temp7 = JSON.stringify(batch.stageClassicLoadBalancers)
    batch.stageClassicLoadBalancers = temp7
  }
  if (batch.hasOwnProperty('classicLoadBalancers')) {
    var temp8 = JSON.stringify(batch.classicLoadBalancers)
    batch.classicLoadBalancers = temp8
  }
}

// collection: artifactStream
function artifactStreamTrans(batch) {
  if (batch.hasOwnProperty('keywords')) {
    var temp1 = JSON.stringify(batch.keywords)
    batch.keywords = temp1
  }
  if (batch.hasOwnProperty('filters')) {
    var temp1 = JSON.stringify(batch.filters)
    batch.filters = temp1
  }
  if (batch.hasOwnProperty('tags')) {
    var temp1 = JSON.stringify(batch.tags)
    batch.tags = temp1
  }
  if (batch.hasOwnProperty('templateVariables')) {
    var temp1 = JSON.stringify(batch.templateVariables)
    batch.templateVariables = temp1
  }
  if (batch.hasOwnProperty('scripts')) {
    var temp1 = JSON.stringify(batch.scripts)
    batch.scripts = temp1
  }
}

// collection: environments
function environmentsTrans(batch) {
  if (batch.hasOwnProperty('helmValueYamlByServiceTemplateId')) {
    var temp1 = JSON.stringify(batch.helmValueYamlByServiceTemplateId)
    batch.helmValueYamlByServiceTemplateId = temp1
  }
  if (batch.hasOwnProperty('configMapYamlByServiceTemplateId')) {
    var temp2 = JSON.stringify(batch.configMapYamlByServiceTemplateId)
    batch.configMapYamlByServiceTemplateId = temp2
  }
}

// collection: notificationGroups
function notificationGroupsTrans(batch) {
  if (batch.hasOwnProperty('addressesByChannelType')) {
    var temp1 = JSON.stringify(batch.addressesByChannelType)
    batch.addressesByChannelType = temp1
  }
  if (batch.hasOwnProperty('configMapYamlByServiceTemplateId')) {
    var temp2 = JSON.stringify(batch.configMapYamlByServiceTemplateId)
    batch.configMapYamlByServiceTemplateId = temp2
  }
}

// collection: deploymentSummary
function deploymentSummaryTrans(batch) {
  var temp1 = JSON.stringify(batch.deploymentInfo)
  batch.deploymentInfo = temp1
}

// collection: pipelines
function pipelinesTrans(batch) {
  var temp1 = JSON.stringify(batch.pipelineStages)
  batch.pipelineStages = temp1
  if (batch.hasOwnProperty('failureStrategies')) {
    var temp2 = JSON.stringify(batch.failureStrategies)
    batch.failureStrategies = temp2
  }
  if (batch.hasOwnProperty('stateEtaMap')) {
    var temp2 = JSON.stringify(batch.stateEtaMap)
    batch.stateEtaMap = temp2
  }
}

// collection: triggers
function triggersTrans(batch) {
  var temp1 = JSON.stringify(batch.artifactSelections)
  batch.artifactSelections = temp1
  var temp2 = JSON.stringify(batch.condition)
  batch.condition = temp2
  if (batch.hasOwnProperty('failureStrategies')) {
    var temp3 = JSON.stringify(batch.failureStrategies)
    batch.failureStrategies = temp3
  }
  if (batch.hasOwnProperty('stateEtaMap')) {
    var temp4 = JSON.stringify(batch.stateEtaMap)
    batch.stateEtaMap = temp4
  }
  if (batch.hasOwnProperty('workflowVariables')) {
    var temp5 = JSON.stringify(batch.workflowVariables)
    batch.workflowVariables = temp5
  }
}

// collection: userGroups
function userGroupsTrans(batch) {
  if (batch.hasOwnProperty('memberIds')) {
    var temp1 = JSON.stringify(batch.memberIds)
    batch.memberIds = temp1
  }
  if (batch.hasOwnProperty('appPermissions')) {
    var temp2 = JSON.stringify(batch.appPermissions)
    batch.appPermissions = temp2
  }
}

// collection: delegateScopes
function delegateScopesTrans(batch) {
  if (batch.hasOwnProperty('serviceInfrastructures')) {
    var temp1 = JSON.stringify(batch.serviceInfrastructures)
    batch.serviceInfrastructures = temp1
  }
  if (batch.hasOwnProperty('environments')) {
    var temp2 = JSON.stringify(batch.environments)
    batch.environments = temp2
  }
  if (batch.hasOwnProperty('environmentTypes')) {
    var temp3 = JSON.stringify(batch.environmentTypes)
    batch.environmentTypes = temp3
  }
  if (batch.hasOwnProperty('taskTypes')) {
    var temp4 = JSON.stringify(batch.taskTypes)
    batch.taskTypes = temp4
  }
  if (batch.hasOwnProperty('applications')) {
    var temp5 = JSON.stringify(batch.applications)
    batch.applications = temp5
  }
}

// collection: hosts
function hostsTrans(batch) {
  var temp = JSON.stringify(batch.instance)
  batch.instance = temp
  if (batch.hasOwnProperty('ec2Instance')) {
    var temp1 = JSON.stringify(batch.ec2Instance)
    batch.ec2Instance = temp1
  }
  if (batch.hasOwnProperty('properties')) {
    var temp2 = JSON.stringify(batch.properties)
    batch.properties = temp2
  }
}

// collection: instance
function instanceTrans(batch) {
  if (batch.hasOwnProperty('instanceInfo')) {
    var temp1 = JSON.stringify(batch.instanceInfo)
    batch.instanceInfo = temp1
  }
  if (batch.hasOwnProperty('podInstanceKey')) {
    var temp2 = JSON.stringify(batch.podInstanceKey)
    batch.podInstanceKey = temp2
  }
  if (batch.hasOwnProperty('pcfInstanceKey')) {
    var temp3 = JSON.stringify(batch.pcfInstanceKey)
    batch.pcfInstanceKey = temp3
  }
  if (batch.hasOwnProperty('containerInstanceKey')) {
    var temp4 = JSON.stringify(batch.containerInstanceKey)
    batch.containerInstanceKey = temp4
  }
  if (batch.hasOwnProperty('hostInstanceKey')) {
    var temp4 = JSON.stringify(batch.hostInstanceKey)
    batch.hostInstanceKey = temp4
  }
}

// collection: audits
function auditsTrans(batch) {
  if (batch.hasOwnProperty('remoteUser')) {
    var temp1 = JSON.stringify(batch.remoteUser)
    batch.remoteUser = temp1
  }
  if (batch.hasOwnProperty('entityAuditRecords')) {
    var temp2 = JSON.stringify(batch.entityAuditRecords)
    batch.entityAuditRecords = temp2
  }
  if (batch.hasOwnProperty('gitAuditDetails')) {
    var temp3 = JSON.stringify(batch.gitAuditDetails)
    batch.gitAuditDetails = temp3
  }
}

// collection: artifacts
function artifactsTrans(batch) {
  if (batch.hasOwnProperty('metadata')) {
    var temp1 = JSON.stringify(batch.metadata)
    batch.metadata = temp1
  }
  if (batch.hasOwnProperty('artifactFiles')) {
    var temp2 = JSON.stringify(batch.artifactFiles)
    batch.artifactFiles = temp2
  }
}

// collection: stateExecutionInstances
function stateExecutionInstancesTrans(batch) {
  if (batch.hasOwnProperty('contextElements')) {
    var temp1 = JSON.stringify(batch.contextElements)
    batch.contextElements = temp1
  }
  if (batch.hasOwnProperty('contextElement')) {
    var temp2 = JSON.stringify(batch.contextElement)
    batch.contextElement = temp2
  }
  if (batch.hasOwnProperty('stateExecutionMap')) {
    var temp3 = JSON.stringify(batch.stateExecutionMap)
    batch.stateExecutionMap = temp3
  }
  if (batch.hasOwnProperty('notifyElements')) {
    var temp4 = JSON.stringify(batch.notifyElements)
    batch.notifyElements = temp4
  }
  if (batch.hasOwnProperty('interruptHistory')) {
    var temp5 = JSON.stringify(batch.interruptHistory)
    batch.interruptHistory = temp5
  }
  if (batch.hasOwnProperty('stateExecutionDataHistory')) {
    var temp6 = JSON.stringify(batch.stateExecutionDataHistory)
    batch.stateExecutionDataHistory = temp6
  }
  if (batch.hasOwnProperty('stateParams')) {
    var temp7 = JSON.stringify(batch.stateParams)
    batch.stateParams = temp7
  }
  if (batch.hasOwnProperty('executionEventAdvisors')) {
    var temp8 = JSON.stringify(batch.executionEventAdvisors)
    batch.executionEventAdvisors = temp8
  }
}

// collection: activities
function activitiesTrans(batch) {
  var temp1 = JSON.stringify(batch.commandUnits)
  batch.commandUnits = temp1
}

// collection: containerTasks
function containerTasksTrans(batch) {
  if (batch.hasOwnProperty('containerDefinitions')) {
    var temp1 = JSON.stringify(batch.containerDefinitions)
    batch.containerDefinitions = temp1
  }
}

// collection: lambdaSpecifications
function lambdaSpecificationsTrans(batch) {
  var temp = JSON.stringify(batch.functions)
  batch.functions = temp
  if (batch.hasOwnProperty('defaults')) {
    var temp1 = JSON.stringify(batch.defaults)
    batch.defaults = temp1
  }
}

// collection: notifications
function notificationsTrans(batch) {
  if (batch.hasOwnProperty('notificationTemplateVariables')) {
    var temp1 = JSON.stringify(batch.notificationTemplateVariables)
    batch.notificationTemplateVariables = temp1
  }
}

// collection: terraformConfig
function terraformConfigTrans(batch) {
  var temp = JSON.stringify(batch.variables)
  batch.variables = temp
}
