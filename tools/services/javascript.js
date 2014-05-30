/**
 * <%= service.description %>
 *
 * @class <%= className %>
 * @implements <%= service.id %>
 * <% Object.keys(service.events||{}).forEach(function(eventName, i) { %><% var event = service.events[eventName];%>
 * @event <%= eventName %><% if (event.value.type) {%> {<%= event.value.type %>}<% } %> <%= event.description||'' %><% }); %>
 */

function <%= className %>() {
  Ninja.bindService('<%= service.id %>', this, '$home/services/<%= className %>');
}
<%
%><% if (service.methods) { %><%
%><% Object.keys(service.methods).forEach(function(methodName, i) { %><% var method = service.methods[methodName]; %>
/**
 * <%= method.description %>
 * @method <%= methodName %>
 *
 *<% (method.params||[]).forEach(function(param, i) { %>
 * @param {<%= param.value.type %>} <%= param.name %> <%= param.description||'' %><% }); %>
 * @param {Function} cb The callback function
 * @param {NinjaError} cb.err The error object
 * @param {<%= method.returns.value.type %>} cb.result <%= method.returns.description||'' %>
 */
<%= className %>.prototype.<%= methodName %> = function(<% (method.params||[]).forEach(function(param, i) { %><%= param.name %>, <% }); %>cb) {

};
<%
%><% }) %><% } %>
module.exports = <%= className %>;
