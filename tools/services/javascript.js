/**
 * <%= service.description %>
 *
 * @class <%= className %>
 * @implements <%= service.id %>
 * <% Object.keys(service.events||{}).forEach(function(event, i) { %>
 * @event <%= event %> <% }); %>
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
 * @param {<%= method.returns.type %>} cb.result
 */
<%= className %>.prototype.<%= methodName %> = function(<% (method.params||[]).forEach(function(param, i) { %><%= param.name %>, <% }); %>cb) {

};
<%
%><% }) %><% } %>
module.exports = <%= className %>;
