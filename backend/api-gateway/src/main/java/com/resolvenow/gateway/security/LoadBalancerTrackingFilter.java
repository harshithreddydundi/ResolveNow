package com.resolvenow.gateway.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.URI;

@Component
public class LoadBalancerTrackingFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(LoadBalancerTrackingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            URI routeUri = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR);
            if (routeUri != null) {
                String target = routeUri.toString();
                String port = String.valueOf(routeUri.getPort());
                exchange.getResponse().getHeaders().set("X-LoadBalanced-Target", target);
                exchange.getResponse().getHeaders().set("X-LoadBalanced-Port", port);
                log.info("[LoadBalancer] Dispatched request {} to instance -> {}:{}",
                        exchange.getRequest().getPath(), routeUri.getHost(), port);
            }
        }));
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
