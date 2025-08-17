import React, { PureComponent } from 'react';

import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { ConfigSection, DataSourceDescription } from '@grafana/experimental';
import { ConnectionConfig } from '@grafana/google-sdk';
import { reportInteraction, config } from '@grafana/runtime';
import { Divider, SecureSocksProxySettings, Field, Input } from '@grafana/ui';

import { CloudMonitoringOptions, CloudMonitoringSecureJsonData } from '../../types/types';

export type Props = DataSourcePluginOptionsEditorProps<CloudMonitoringOptions, CloudMonitoringSecureJsonData>;

export class ConfigEditor extends PureComponent<Props> {
  handleOnOptionsChange = (options: Props['options']) => {
    if (options.jsonData.privateKeyPath || options.secureJsonFields['privateKey']) {
      reportInteraction('grafana_cloud_monitoring_config_changed', {
        authenticationType: 'JWT',
        privateKey: options.secureJsonFields['privateKey'],
        privateKeyPath: !!options.jsonData.privateKeyPath,
      });
    }
    this.props.onOptionsChange(options);
  };

  render() {
    const { options, onOptionsChange } = this.props;
    return (
      <>
        <DataSourceDescription
          dataSourceName="Google Cloud Monitoring"
          docsLink="https://grafana.com/docs/grafana/latest/datasources/google-cloud-monitoring/"
          hasRequiredFields
        />
        <Divider />
        <ConnectionConfig {...this.props} onOptionsChange={this.handleOnOptionsChange}></ConnectionConfig>
        <Divider />
        <ConfigSection
          title="Additional settings"
          description="Additional settings are optional settings that can be configured for more control over your data source."
          isCollapsible={true}
          isInitiallyOpen={options.jsonData.universeDomain !== undefined}
        >
          <Field
            label="Universe Domain"
            description="The universe domain to use for the API. If not specified, the default domain is used."
          >
            <Input
              width={60}
              id="universeDomain"
              value={options.jsonData.universeDomain}
              placeholder="googleapis.com"
              onChange={(e) =>
                onOptionsChange({
                  ...options,
                  jsonData: {
                    ...options.jsonData,
                    universeDomain: e.currentTarget.value,
                  },
                })
              }
            />
          </Field>
        </ConfigSection>
        {config.secureSocksDSProxyEnabled && (
          <>
            <Divider />
            <ConfigSection
              title="Additional settings"
              description="Additional settings are optional settings that can be configured for more control over your data source. This includes Secure Socks Proxy."
              isCollapsible={true}
              isInitiallyOpen={options.jsonData.enableSecureSocksProxy !== undefined}
            >
              <SecureSocksProxySettings options={options} onOptionsChange={onOptionsChange} />
            </ConfigSection>
          </>
        )}
      </>
    );
  }
}
