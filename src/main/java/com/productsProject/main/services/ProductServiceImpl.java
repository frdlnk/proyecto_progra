/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.productsProject.main.services;


import com.productsProject.main.models.Product;
import com.productsProject.main.repository.ProductRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

/**
 *
 * @author lab.informatica
 */
@Service
@Lazy
public class ProductServiceImpl implements ProductService {

    @Autowired
    @Lazy
    private ProductRepository productRepository;
    
    @Override
    public List<Product> getProducts() {
        return productRepository.getProducts();
    }
    
    @Override
    public Product getProduct(int id) {
        return productRepository.getProduct(id);
    }
    
    @Override
    public Product postProduct(Product products) {
        return productRepository.postProduct(products);
    }
    
    @Override
    public Product putProduct(Product product) {
        return productRepository.putProduct(product);
    }
    
    @Override
    public boolean deleteProduct(int id) {
        return productRepository.deleteProduct(id);
    }
    
    @Override
    public Product patchProduct(Product product) {
        return productRepository.patchProduct(product);
    }
    
}
