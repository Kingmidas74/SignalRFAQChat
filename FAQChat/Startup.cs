using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;

[assembly: OwinStartup(typeof(FAQChat.Startup))]

namespace FAQChat
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var hubConfiguration = new HubConfiguration();
            hubConfiguration.EnableDetailedErrors = true;
            hubConfiguration.EnableJSONP = true;            
            hubConfiguration.EnableJavaScriptProxies = true;

            app.UseCors(CorsOptions.AllowAll);

            app.MapSignalR(hubConfiguration);
        }
    }
}
