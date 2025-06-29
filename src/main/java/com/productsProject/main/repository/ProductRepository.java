/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.productsProject.main.repository;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.productsProject.main.models.Product;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

/**
 *
 * @author lab.informatica
 */

@Repository
@Lazy
public class ProductRepository {
    
    private static final Gson gson = new Gson();

    private List<Product> readJsonFile() {
        ArrayList<Product> products = null;
        BufferedReader input = null;
        try {
            input = new BufferedReader(new FileReader("files/products.json"));
            products = gson.fromJson(input, new TypeToken<ArrayList<Product>>() {
            }.getType());
        } catch (IOException ex) {
            System.err.println("IOException: " + ex.getMessage());
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException ex) {
                    System.err.println("IOException: " + ex.getMessage());
                }
            }
        }
        return products;
    }

    private void writeJsonFile(List<Product> products) {
        BufferedWriter output = null;
        try {
            output = new BufferedWriter(new FileWriter("files/products.json"));
            output.write(gson.toJson(products));
        } catch (IOException ex) {
            System.err.println("IOException: " + ex.getMessage());
        } finally {
            if (output != null) {
                try {
                    output.close();
                } catch (IOException ex) {
                    System.err.println("IOException: " + ex.getMessage());
                }
            }
        }
    }
    
    public List<Product> getProducts() {
        return readJsonFile();
    }
    
    public Product getProduct(int id) {
        List<Product> products= readJsonFile();
        
        if (products != null) {
        
        for (Product product : products) {
            if (product.getId() == id) {
                return product;
            }
        }
        
        }
        
        return null;
    }
    
    public Product postProduct(Product product) {
        
        List<Product> products= readJsonFile();
        
        if (products != null) { ////Eta vaina esta rara
        
            product.setId(products.get(products.size() - 1).getId() + 1);
            products.add(product);
            writeJsonFile(products);
            return product;
            
        }
        
        return null;
    }
    
    public Product putProduct(Product product) {
        
        List<Product> products= readJsonFile();
        
        if (products != null) {
        
            for (Product product_temp : products) {
                if (product_temp.getId() == product.getId()) {
                    product_temp.setName(product.getName());
                    product_temp.setPrice(product.getPrice());
                    product_temp.setDescription(product.getDescription());
                    product_temp.setImageUrl(product.getImageUrl());
                    writeJsonFile(products);
                    return product_temp;            
                }
            }
        
        }
        
        return null;
        
    }
    
    public boolean deleteProduct(int id) {
        
        List<Product> products= readJsonFile();
        
        if (products != null) {
        
            for (Product product : products) {
                if (product.getId() == id) {
                    products.remove(product);
                    writeJsonFile(products);
                    return true;
                }
            }
        
        }
        
        return false;
        
    }
    
    public Product patchProduct(Product product) {
        
        List<Product> products= readJsonFile();
        
        if (products != null) {
        
            for (Product product_temp : products) {
                if (product_temp.getId() == product.getId()) {
                    if (product.getName() != null) {
                        product_temp.setName(product.getName());
                    }
                    if (product.getPrice()!= 0.0) {
                        product_temp.setPrice(product.getPrice());
                    }
                    if (product.getDescription()!= null) {
                        product_temp.setDescription(product.getDescription());
                    }
                    if (product.getImageUrl()!= null) {
                        product_temp.setImageUrl(product.getImageUrl());
                    }
                    writeJsonFile(products);
                    return product_temp;
                }
            }
        
        }
        
        return null;
    }
    
}
